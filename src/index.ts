import { decode } from "he";

import { Comeback, RawComeback } from "@api/types/comeback";
import { getPage } from "@api/services/reddit";

const dateForURL = (date: Date): string => {
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ];
  return `${date.getFullYear()}/${monthNames[date.getMonth()]}`;
};

const getNextMonth = (date: Date): Date => {
  if (date.getMonth() === 11) {
    return new Date(date.getFullYear() + 1, 0, 1);
  }

  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const stringToDate = (comeback: RawComeback): Date => {
  return new Date(`${comeback.year} ${comeback.month} ${comeback.day} ${comeback.time} GMT+9`);
};

const formatComebacks = (comebacks: RawComeback[]): Comeback[] => {
  const currentDay = new Date();
  return comebacks
    .map((comeback, index) => {
      comeback.day = comeback.day || comebacks[index - 1].day;
      comeback.time = comeback.time || comebacks[index - 1].time;
      const dateObj = stringToDate(comeback);
      if (currentDay > dateObj) return null;
      return {
        date: dateObj.getTime(),
        title: comeback.title
      };
    })
    .filter((comeback): comeback is Comeback => comeback !== null);
};

const getComebacks = async (date: Date): Promise<Comeback[]> => {
  try {
    const formattedDate = dateForURL(date);
    const json = await getPage(`https://www.reddit.com/r/kpop/wiki/upcoming-releases/${formattedDate}.json`);
    const markdownContent = json.data.content_md;
    const tableStart = markdownContent.indexOf("|Day|Time|Artist|Album Title|Album Type|Title Track|");
    const tableEnd = markdownContent.indexOf("Announced Releases:");
    const allComebacks = markdownContent.slice(tableStart, tableEnd).trim().split("\n");
    const unformattedComebacks = allComebacks
      .slice(2)
      .map((comeback) => {
        const [, dayStr, time, artistStr, detailStr] = comeback.split("|");
        if (!artistStr) return null;
        if (time === "?") return null;
        const artist = artistStr.replace(/^\*|\*$/g, "");
        const detail = detailStr.replace(/^\*|\*$/g, "");
         const day = dayStr !== "" ? /\d+/.exec(dayStr)?.[0] ?? "" : dayStr;
        const [year, month] = formattedDate.split("/");
        const title = decode(detail === "" ? artist : `${artist} - ${detail}`);

        return { year, month, day, time, title };
      })
      .filter((comeback): comeback is RawComeback => comeback !== null);
    return formatComebacks(unformattedComebacks)
      .sort((a, b) => a.title.localeCompare(b.title))
      .sort((a, b) => a.date - b.date);
  } catch (error) {
    console.error("Error fetching comebacks:", error);
    return [];
  }
};

const getAllComebacksUpstream = async (env: Env): Promise<Comeback[]> => {
  const currentDate = new Date();
  const currentMonthComebacks = await getComebacks(currentDate);
  const nextMonthComebacks = await getComebacks(getNextMonth(currentDate));
  const allComebacks = [...currentMonthComebacks, ...nextMonthComebacks];
  if (allComebacks.length > 0) {
    await env.data.put("comebacks", JSON.stringify(allComebacks), {
      metadata: { timestamp: Date.now() }
    });
  }
  return allComebacks;
};

const getAllComebacks = async (env: Env): Promise<Comeback[]> => {
  const cacheMaxAge = 6 * 60 * 60 * 1000;
  const { value, metadata } = await env.data.getWithMetadata<{ timestamp: number }>("comebacks");
  try {
    if (!value || !metadata) throw new Error("No cache");
    const comebacks: Comeback[] = JSON.parse(value);
    if (Date.now() - metadata.timestamp >= cacheMaxAge || new Date() > new Date(comebacks[0].date)) {
      throw new Error("Cache expired");
    }
    return comebacks;
  } catch {
    const comebacks = await getAllComebacksUpstream(env);
    if (comebacks.length === 0) {
      if (value) {
        return JSON.parse(value);
      }
      return [];
    }
    return comebacks;
  }
};

export default {
  async fetch(_, env): Promise<Response> {
    return new Response(JSON.stringify(await getAllComebacks(env)), {
      headers: { "Content-Type": "application/json" }
    });
  }
} satisfies ExportedHandler<Env>;

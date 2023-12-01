import { decode } from 'he';

const dateForURL = (date) => {
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  return `${date.getFullYear()}/${monthNames[date.getMonth()]}`;
};

const getNextMonth = (date) => {
  let nextMonth;
  if (date.getMonth() === 11) {
    nextMonth = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }
  return nextMonth;
};

const timestampMaker = (comeback) => {
  return new Date(`${comeback.year} ${comeback.month} ${comeback.day} ${comeback.time} GMT+9`);
};

const formatComebacks = (comebacks) => {
  const currentDay = new Date();
  return comebacks.map((comeback, index) => {
    if (comeback.day === '') comeback.day = comebacks[index - 1].day;
    if (comeback.time === '') comeback.time = comebacks[index - 1].time;
    let date = timestampMaker(comeback);
    if (currentDay > date) return false;
    date = date.getTime();
    return {
      date,
      title: comeback.title
    };
  }).filter((comeback) => comeback);
};

const headerRegExp = () => {
  return new RegExp(
    '\\|Day\\|Time\\|Artist\\|Album Title\\|Album Type\\|Title Track\\|Streaming'
    + '(\\r\\n|\\n)'
    + '\\|--\\|--\\|--\\|--\\|--\\|--\\|--'
    + '(\\r\\n|\\n)'
  );
};

const getComebacks = async (date) => {
  try {
    const formattedDate = dateForURL(date);
    const json = await fetch(`https://www.reddit.com/r/kpop/wiki/upcoming-releases/${formattedDate}.json`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
      }
    }).then((response) => response.json());
    const allComebacks = json.data.content_md
      .split(headerRegExp())[3]
      .split(/(\r\n\r\n|\n\n)\[Auto-updating Spotify Playlist \(Recent Title Tracks\)\]/)[0]
      .split(/\r\n|\n/);
    const unformattedComebacks = allComebacks.map((comeback) => {
      // eslint-disable-next-line prefer-const
      let [, day, time, artist, detail] = comeback.split('|');
      if (time === '?') return false;
      artist = artist.replace(/^\*|\*$/g, '');
      detail = detail.replace(/^\*|\*$/g, '');
      if (day !== '') day = /\d+/.exec(day);
      const [year, month] = formattedDate.split('/');
      let title = (detail === '') ? artist : `${artist} - ${detail}`;
      title = decode(title);
      return {
        year, month, day, time, title
      };
    }).filter((comeback) => comeback);
    return formatComebacks(unformattedComebacks)
      .sort((a, b) => a.title.localeCompare(b.title))
      .sort((a, b) => a.date - b.date);
  } catch (_) {
    return [];
  }
};

const getAllComebacksUpstream = async (env) => {
  const currentDate = new Date();
  const currentMonthComebacks = await getComebacks(currentDate);
  const nextMonthComebacks = await getComebacks(getNextMonth(currentDate));
  const allComebacks = [...currentMonthComebacks, ...nextMonthComebacks];
  await env.data.put('comebacks', JSON.stringify(allComebacks), {
    metadata: { timestamp: Date.now() }
  });
  return allComebacks;
};

const getAllComebacks = async (env) => {
  const cacheMaxAge = 6 * 60 * 60 * 1000;
  const dataKV = await env.data.getWithMetadata('comebacks');
  let { value: comebacks } = dataKV;
  const { metadata } = dataKV;
  try {
    comebacks = JSON.parse(comebacks);
    if ((Date.now() - metadata.timestamp) >= cacheMaxAge || new Date() > new Date(comebacks[0].date)) {
      throw new Error('Cache expired');
    }
  } catch (_) {
    comebacks = await getAllComebacksUpstream(env);
  }
  return comebacks;
};

const handleRequest = async (env) => {
  return new Response(JSON.stringify(await getAllComebacks(env)), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
  });
};

export { handleRequest, getAllComebacks };

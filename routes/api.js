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

const timestampMaker = (release) => {
  return new Date(`${release.year} ${release.month} ${release.day} ${release.time} GMT+9`).getTime();
};

const formatReleases = (releases) => {
  return releases.map((release, index) => {
    if (release.day === '') release.day = releases[index - 1].day;
    if (release.time === '') release.time = releases[index - 1].time;
    const date = timestampMaker(release);
    return {
      date,
      title: release.title
    };
  }).filter((release) => new Date(release.date) > new Date());
};

const getReleases = async (date) => {
  const json = await fetch(`https://www.reddit.com/r/kpop/wiki/upcoming-releases/${date}.json`)
    .then((response) => response.json());
  const releasesTable = json.data.content_md
    .split(/\|Day\|Time\|Artist\|Album Title\|Album Type\|Title Track\|Streaming(\r\n|\n)\|--\|--\|--\|--\|--\|--\|--(\r\n|\n)/)[3]
    .split(/(\r\n\r\n|\n\n)\[Auto-updating Spotify Playlist \(Recent Title Tracks\)\]/)[0];
  const allReleases = releasesTable
    .replaceAll(/\*\|\*|\*\||\|\*/g, '|')
    .split(/\r\n|\n/);
  const unformattedReleases = allReleases.map((release) => {
    const [, ordinalDay, time, artist, detail] = release.split('|');
    const day = (ordinalDay !== '') ? /\d+/.exec(ordinalDay) : '';
    const [year, month] = date.split('/');
    let title = (detail === '') ? artist : `${artist} - ${detail}`;
    title = decode(title);
    return {
      year, month, day, time, title
    };
  }).filter((release) => release.time !== '?');
  return formatReleases(unformattedReleases)
    .sort((a, b) => a.title.localeCompare(b.title))
    .sort((a, b) => a.date - b.date);
};

const metadataMaker = (releases) => {
  return [...new Set(releases.map((release) => release.date))][1];
};

const getAllReleasesUpstream = async () => {
  const currentDate = new Date();
  const currentMonth = dateForURL(currentDate);
  const nextMonth = dateForURL(getNextMonth(currentDate));
  const currentMonthReleases = await getReleases(currentMonth);
  const nextMonthReleases = await getReleases(nextMonth);
  const allReleases = [...currentMonthReleases, ...nextMonthReleases];
  await cache.put('releases', JSON.stringify(allReleases), {
    metadata: { date: metadataMaker(allReleases) },
  });
  return allReleases;
};

const getAllReleases = async () => {
  const KVCache = await cache.getWithMetadata('releases');
  let { value: releases } = KVCache;
  const { metadata: { date } } = KVCache;
  if (releases === null || new Date() > new Date(date)) {
    releases = await getAllReleasesUpstream();
  } else {
    releases = JSON.parse(releases);
  }
  return releases.filter((release) => new Date(release.date) > new Date());
};

const handleRequest = async () => {
  return new Response(JSON.stringify(await getAllReleases()), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
  });
};

export { handleRequest, getAllReleases };

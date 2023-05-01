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
  return new Date(`${release.year} ${release.month} ${release.day} ${release.time} GMT+9`);
};

const formatReleases = (releases) => {
  const currentDay = new Date();
  return releases.map((release, index) => {
    if (release.day === '') release.day = releases[index - 1].day;
    if (release.time === '') release.time = releases[index - 1].time;
    let date = timestampMaker(release);
    if (currentDay > date) return false;
    date = date.getTime();
    return {
      date,
      title: release.title
    };
  }).filter((release) => release);
};

const getReleases = async (date) => {
  const formattedDate = dateForURL(date);
  const json = await fetch(`https://www.reddit.com/r/kpop/wiki/upcoming-releases/${formattedDate}.json`)
    .then((response) => response.json());
  const allReleases = json.data.content_md
    .split(/\|Day\|Time\|Artist\|Album Title\|Album Type\|Title Track\|Streaming(\r\n|\n)\|--\|--\|--\|--\|--\|--\|--(\r\n|\n)/)[3]
    .split(/(\r\n\r\n|\n\n)\[Auto-updating Spotify Playlist \(Recent Title Tracks\)\]/)[0]
    .split(/\r\n|\n/);
  const unformattedReleases = allReleases.map((release) => {
    // eslint-disable-next-line prefer-const
    let [, day, time, artist, detail] = release.split('|');
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
  }).filter((release) => release);
  return formatReleases(unformattedReleases)
    .sort((a, b) => a.title.localeCompare(b.title))
    .sort((a, b) => a.date - b.date);
};

const getAllReleasesUpstream = async () => {
  const currentDate = new Date();
  const currentMonthReleases = await getReleases(currentDate);
  const nextMonthReleases = await getReleases(getNextMonth(currentDate));
  const allReleases = [...currentMonthReleases, ...nextMonthReleases];
  await cache.put('releases', JSON.stringify(allReleases), {
    metadata: { timestamp: Date.now() }
  });
  return allReleases;
};

const getAllReleases = async () => {
  const cacheMaxAge = 6 * 60 * 60 * 1000;
  const KVCache = await cache.getWithMetadata('releases');
  let { value: releases } = KVCache;
  const { metadata } = KVCache;
  if (releases) releases = JSON.parse(releases);
  if (!releases || cacheMaxAge > (Date.now() - metadata.timestamp)
      || new Date() > new Date(releases[0].date)) {
    releases = await getAllReleasesUpstream();
  }
  return releases;
};

const handleRequest = async () => {
  return new Response(JSON.stringify(await getAllReleases()), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
  });
};

export { handleRequest, getAllReleases };

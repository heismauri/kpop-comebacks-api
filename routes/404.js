const notFound = async () => {
  const result = await fetch('https://www.heismauri.com/404.html')
    .then((response) => response.text());
  return new Response(result, {
    status: 404,
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    }
  });
};

export default notFound;

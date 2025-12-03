 const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const error = new Error('invalidRSS');
    error.isParsingError = true;
    throw error;
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    const error = new Error('invalidRSS');
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = channel.querySelector('title')?.textContent || '';
  const feedDescription = channel.querySelector('description')?.textContent || '';

  const items = channel.querySelectorAll('item');
  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
  }));

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };

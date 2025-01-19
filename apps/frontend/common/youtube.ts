export const getYoutubeEmbedUrl = (url: string, autoplay = true) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match?.[2];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=1&mute=0`
    : url;
};

export const getYoutubeThumbnailUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match?.[2];
  return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
};

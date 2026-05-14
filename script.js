document.addEventListener('DOMContentLoaded', function() {
  const videoUrlInput = document.getElementById('videoUrl');
  const fetchBtn = document.getElementById('fetchBtn');
  const preview = document.getElementById('preview');
  const thumbnailImg = document.getElementById('thumbnailImg');
  const downloadLink = document.getElementById('downloadLink');
  const errorDiv = document.getElementById('error');

  function extractVideoID(url) {
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  function getThumbnailURL(videoID, quality = 'maxresdefault') {
    return `https://img.youtube.com/vi/${videoID}/${quality}.jpg`;
  }

  function showThumbnail(videoID) {
    const thumbnailURL = getThumbnailURL(videoID);
    thumbnailImg.src = thumbnailURL;
    preview.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    // Fetch the image as blob for download (avoids CORS issues)
    fetch(thumbnailURL)
      .then(response => {
        if (!response.ok) throw new Error('Image not available');
        return response.blob();
      })
      .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        downloadLink.href = blobURL;
        downloadLink.download = 'youtube_thumbnail_' + videoID + '.jpg';
      })
      .catch(() => {
        // Fallback: just link to the image (may not download directly)
        downloadLink.href = thumbnailURL;
        downloadLink.download = 'thumbnail.jpg';
      });
  }

  function handleFetch() {
    const url = videoUrlInput.value.trim();
    if (!url) {
      errorDiv.textContent = '❌ कृपया YouTube वीडियो का लिंक डालें।';
      errorDiv.classList.remove('hidden');
      preview.classList.add('hidden');
      return;
    }

    const videoID = extractVideoID(url);
    if (!videoID) {
      errorDiv.textContent = '❌ कृपया सही YouTube वीडियो लिंक डालें।';
      errorDiv.classList.remove('hidden');
      preview.classList.add('hidden');
      return;
    }

    showThumbnail(videoID);
  }

  fetchBtn.addEventListener('click', handleFetch);
  videoUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleFetch();
  });

  // Preload a default thumbnail for demo (optional)
  // comment out if not needed
  // setTimeout(() => {
  //   videoUrlInput.value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  //   handleFetch();
  // }, 1000);
});
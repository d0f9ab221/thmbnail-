// YouTube Thumbnail Downloader - Main Script

const youtubeUrlInput = document.getElementById('youtubeUrl');
const extractBtn = document.getElementById('extractBtn');
const resultSection = document.getElementById('resultSection');
const thumbnailPreview = document.getElementById('thumbnailPreview');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const qualityButtons = document.querySelectorAll('.quality-btn');

let currentVideoId = null;
let currentThumbnailUrl = null;
let selectedQuality = 'maxresdefault';

// Extract Video ID from YouTube URL or direct ID
function extractVideoId(input) {
    // Remove whitespace
    input = input.trim();

    // Direct Video ID (11 characters, alphanumeric with - and _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
    }

    // YouTube.com URL patterns
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = input.match(youtubeRegex);

    if (match && match[1]) {
        return match[1];
    }

    return null;
}

// Generate thumbnail URL based on quality
function getThumbnailUrl(videoId, quality) {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Hide result section
function hideResultSection() {
    resultSection.classList.add('hidden');
}

// Show result section
function showResultSection() {
    resultSection.classList.remove('hidden');
}

// Update thumbnail preview
function updateThumbnailPreview() {
    if (currentVideoId && selectedQuality) {
        currentThumbnailUrl = getThumbnailUrl(currentVideoId, selectedQuality);
        
        // Create a temporary image to check if the quality exists
        const img = new Image();
        img.onload = () => {
            thumbnailPreview.src = currentThumbnailUrl;
        };
        img.onerror = () => {
            // If quality doesn't exist, try a fallback
            const fallbackUrl = getThumbnailUrl(currentVideoId, 'hqdefault');
            thumbnailPreview.src = fallbackUrl;
            currentThumbnailUrl = fallbackUrl;
        };
        img.src = currentThumbnailUrl;
    }
}

// Set active quality button
function setActiveQualityButton(quality) {
    qualityButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.quality === quality) {
            btn.classList.add('active');
        }
    });
}

// Extract thumbnail handler
extractBtn.addEventListener('click', () => {
    const inputValue = youtubeUrlInput.value;

    if (!inputValue.trim()) {
        showError('Please enter a YouTube URL or Video ID');
        hideResultSection();
        return;
    }

    const videoId = extractVideoId(inputValue);

    if (!videoId) {
        showError('Invalid YouTube URL or Video ID. Please check and try again.');
        hideResultSection();
        return;
    }

    currentVideoId = videoId;
    selectedQuality = 'maxresdefault';
    setActiveQualityButton(selectedQuality);
    updateThumbnailPreview();
    showResultSection();
});

// Quality button handlers
qualityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedQuality = btn.dataset.quality;
        setActiveQualityButton(selectedQuality);
        updateThumbnailPreview();
    });
});

// Download thumbnail handler
downloadBtn.addEventListener('click', () => {
    if (!currentThumbnailUrl) {
        showError('No thumbnail to download');
        return;
    }

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = currentThumbnailUrl;
    link.download = `youtube_thumbnail_${currentVideoId}_${selectedQuality}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('✓ Thumbnail downloaded successfully!');
});

// Copy URL handler
copyBtn.addEventListener('click', () => {
    if (!currentThumbnailUrl) {
        showError('No thumbnail URL to copy');
        return;
    }

    navigator.clipboard.writeText(currentThumbnailUrl).then(() => {
        showSuccess('✓ Image URL copied to clipboard!');
    }).catch(err => {
        showError('Failed to copy URL to clipboard');
    });
});

// Allow Enter key to trigger extract
youtubeUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        extractBtn.click();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    hideResultSection();
    setActiveQualityButton(selectedQuality);
});

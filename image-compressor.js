document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const downloadLink = document.getElementById('downloadLink');

    // Update quality value display
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    // Handle file selection and display original image
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
                originalImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Image Compression Logic
    async function handleImageCompression() {
        const file = imageInput.files[0];
        if (!file) {
            alert("Please select an image first!");
            return;
        }

        const compressedBlob = await compressImage(file, qualitySlider.value);
        const compressedUrl = URL.createObjectURL(compressedBlob);

        compressedImage.src = compressedUrl;
        compressedImage.style.display = "block";
        downloadLink.href = compressedUrl;
        downloadLink.classList.remove("hidden");
    }

    async function compressImage(file, quality) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (blob) => resolve(blob),
                        'image/jpeg',
                        quality / 100
                    );
                };
            };
        });
    }

    window.handleImageCompression = handleImageCompression;
});

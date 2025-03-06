document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const compressionLevel = document.getElementById('compressionLevel');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const downloadLink = document.getElementById('downloadLink');

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

        const quality = parseInt(compressionLevel.value);
        const compressedBlob = await compressImage(file, quality);
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

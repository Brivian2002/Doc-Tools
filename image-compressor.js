document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const output = document.getElementById('output');

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    async function handleImageCompression() {
        const file = imageInput.files[0];
        if (!file) {
            alert("Please select an image first!");
            return;
        }

        const compressedImage = await compressImage(file, qualitySlider.value);
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedImage);
        downloadLink.download = "compressed-image.jpg";
        downloadLink.textContent = "Download Compressed Image";
        downloadLink.classList.add("btn");
        
        output.innerHTML = "";
        output.appendChild(downloadLink);
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
});

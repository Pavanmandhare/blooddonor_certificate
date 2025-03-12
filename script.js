let cropper;
let croppedImageURL;

// Handle image upload
document.getElementById('photo-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('cropModal').style.display = 'block';
        const image = document.getElementById('crop-image');
        image.src = event.target.result;

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 2,
            autoCropArea: 0.8,
            movable: true,
            rotatable: true,
            scalable: true
        });
    };
    reader.readAsDataURL(file);
});

// Save cropped image
function saveCrop() {
    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: '#fff'
    });

    croppedImageURL = canvas.toDataURL('image/jpeg');
    document.getElementById('donor-photo').src = croppedImageURL;
    document.getElementById('cropModal').style.display = 'none';
}

// Cancel cropping
function cancelCrop() {
    document.getElementById('cropModal').style.display = 'none';
    document.getElementById('photo-input').value = '';
    if (cropper) {
        cropper.destroy();
    }
}


// Generate certificate
function generateCertificate() {
    // Validate form
    const inputs = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    if (!isValid) {
        alert('Please fill all required fields!');
        return;
    }

    // Update certificate content
    document.getElementById('cert-name').textContent = 
        document.getElementById('donor-name').value;
    document.getElementById('cert-hospital').textContent = 
        document.getElementById('hospital-name').value;
    document.getElementById('cert-location').textContent = 
        document.getElementById('location').value;
    document.getElementById('cert-blood').textContent = 
        document.getElementById('blood-group').value;
    const rawDate = document.getElementById('donation-date').value;
    const formattedDate = rawDate.split('-').reverse().join('-'); // Converts YYYY-MM-DD to DD-MM-YYYY
        document.getElementById('cert-date').textContent = formattedDate;
    document.getElementById('cert-co_ordinator').textContent = 
        document.getElementById('co_ordinator').value;

    // Generate image
    const certificate = document.getElementById('certificate-container');
    certificate.style.display = 'block';

    html2canvas(certificate).then(canvas => {
        const link = document.createElement('a');
        link.download = 'blood-donation-certificate.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        certificate.style.display = 'none';
    });
}
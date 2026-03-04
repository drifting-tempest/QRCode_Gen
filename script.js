const genBtn = document.querySelector(".gen-btn");
const qrCodeBox = document.getElementById("qr-code");
const inputBox = document.getElementById("input-box")

// confetti YAYAY
const confettiContainer = document.createElement("div");
confettiContainer.className = "confetti-container";
document.body.appendChild(confettiContainer);

function createConfetti() {
    for (let i = 0; i <= 50; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";

        const colorChoices = [
            "var(--frozen-water)",
            "var(--baby-blue-ice)", 
            "var(--grape-soda)"
        ];

        piece.style.background = colorChoices[Math.floor(Math.random() * 3)];

        piece.style.animationDelay = Math.random() * 0.4 + "s";
        piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
        
        confettiContainer.appendChild(piece);

        setTimeout(() => piece.remove(), 5000);
    }
}

// QR code generator
genBtn.addEventListener("click", () => {
    const inputValue = inputBox.value.trim();

    qrCodeBox.innerHTML = "";

    if (inputValue === "") {
        qrCodeBox.innerHTML = "<p style='color: rgb(255, 255, 255); padding: 10px;'>Please enter text or a link!</p>";
        return;
    }

    const qrImage = document.createElement("img");
    crossOrigin="anonymous";
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputValue)}&color=9B5094&bgcolor=8fb8de`;
    qrImage.alt = "QR Code";

    qrImage.style.transition = "opacity 0.4s ease";
    qrImage.style.opacity = "0";

    qrCodeBox.appendChild(qrImage);

    setTimeout(() => {
        qrImage.style.opacity = "1";
        createConfetti(); 
    }, 50);
});

// QR code copying mechanism
const copyBtn = document.querySelector(".copy-btn");

copyBtn.addEventListener("click", async () => {
    const qrImage = qrCodeBox.querySelector("img");
    
    if (!qrImage) {
        alert("Generate a QR code first, silly!");
        return;
    }
    
    await new Promise((resolve) => {
        if (qrImage.complete && qrImage.naturalWidth > 0) {
            resolve();
        } else {
            qrImage.onload = () => resolve();
            qrImage.src = qrImage.src; 
        }
    });
    
    const canvas = document.createElement("canvas");
    canvas.width = qrImage.naturalWidth;
    canvas.height = qrImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrImage, 0, 0);
    
    canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        
        copyBtn.textContent = "Copied, yay!";
        copyBtn.style.backgroundColor = "var(--grape-soda)";
        
        setTimeout(() => {
            copyBtn.textContent = "Click to Copy!";
            copyBtn.style.backgroundColor = "var(--baby-blue-ice)";
        }, 1500);
    }, "image/png");
});

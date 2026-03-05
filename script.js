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
        piece.style.top = "-10%";  

        const colorChoices = [
            "var(--frozen-water)",
            "var(--baby-blue-ice)", 
            "var(--grape-soda)"
        ];

        piece.style.background = colorChoices[Math.floor(Math.random() * 3)];
        piece.style.animationDelay = Math.random() * 0.5 + "s";
        piece.style.animationDuration = (Math.random() * 2 + 2) + "s";

        confettiContainer.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

// QR code generator part

genBtn.addEventListener("click", () => {
    const inputValue = inputBox.value.trim();

    qrCodeBox.innerHTML = "";

    if (inputValue === "") {
        qrCodeBox.innerHTML = "<p style='color: var(--baby-blue-ice); padding: 10px; font-family:  'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande','Lucida Sans Unicode', Geneva, Verdana, sans-serif;'>Enter a link, silly!</p>";
        return;
    }

    const qrImage = document.createElement("img");
    qrImage.crossOrigin="anonymous";
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

// QR code copying part

const copyBtn = document.querySelector(".copy-btn");
copyBtn.addEventListener("click", async () => {

    const qrImage = qrCodeBox.querySelector("img");
    if (!qrImage) {
        alert("Generate a QR code first, silly!");
        return;
    }

    try {
        const response = await fetch(qrImage.src);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        copyBtn.textContent = "Copied to clipboard!";
    } catch (err) {
        console.error(err);
        copyBtn.textContent = "Failed to copy to clipboard.";
    }

    setTimeout(() => {
        copyBtn.textContent = "Click to Copy!";
    }, 2000);

});
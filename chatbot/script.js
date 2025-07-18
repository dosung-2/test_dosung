const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');


function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


async function getBotResponse(input) {
    try {
        const res = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });
        const data = await res.json();
        return data.reply || '답변을 가져오지 못했습니다.';
    } catch (e) {
        return '서버 오류가 발생했습니다.';
    }
}


async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage('user', message);
    userInput.value = '';
    appendMessage('bot', '...'); // 로딩 표시
    const botReply = await getBotResponse(message);
    // 마지막 bot 메시지를 실제 답변으로 교체
    const lastMsg = chatBox.querySelector('.message.bot:last-child');
    if (lastMsg) lastMsg.textContent = botReply;
}

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    sendMessage();
});

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

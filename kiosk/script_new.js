// 키오스크 체험관 JavaScript - 랜덤 미션 시스템

// 전역 변수
let selectedKiosk = null;
let isCardFlipped = false;

// 5가지 키오스크 데이터
const kioskData = [
    {
        id: 1,
        name: "농협 키오스크",
        description: "농협 은행업무를 체험해보세요",
        icon: "🏦",
        url: "http://www.xn--2i0b122a69q.kr/nonghyup/index.do",
        mission: "농협 키오스크에서 은행업무를 체험해보세요",
        color: "#4CAF50"
    },
    {
        id: 2,
        name: "카페 키오스크",
        description: "카페에서 음료를 주문해보세요",
        icon: "☕",
        url: "http://www.xn--2i0b122a69q.kr/cafe/intro.do",
        mission: "카페 키오스크에서 음료를 주문해보세요",
        color: "#FF9800"
    },
    {
        id: 3,
        name: "맥도날드 키오스크",
        description: "맥도날드에서 햄버거를 주문해보세요",
        icon: "🍔",
        url: "http://www.xn--2i0b122a69q.kr/mcdonald/index.do",
        mission: "맥도날드 키오스크에서 메뉴를 주문해보세요",
        color: "#FF5722"
    },
    {
        id: 4,
        name: "병원 키오스크",
        description: "병원에서 접수업무를 체험해보세요",
        icon: "🏥",
        url: "http://www.xn--2i0b122a69q.kr/hospital/index.do",
        mission: "병원 키오스크에서 접수를 해보세요",
        color: "#2196F3"
    },
    {
        id: 5,
        name: "무인민원발급 키오스크",
        description: "민원서류를 발급받아보세요",
        icon: "📄",
        url: "http://www.xn--2i0b122a69q.kr/document/index.do",
        mission: "무인민원발급기에서 서류를 발급받아보세요",
        color: "#9C27B0"
    }
];

// 페이지 전환 함수
function goToPage(pageId) {
    // 모든 페이지 숨기기
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 선택된 페이지 보이기
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // 페이지별 초기화
    if (pageId === 'page-home') {
        resetSystem();
    }
}

// 시스템 초기화
function resetSystem() {
    selectedKiosk = null;
    isCardFlipped = false;
    
    // 미션 카드 초기화
    const missionCard = document.getElementById('mission-card');
    if (missionCard) {
        missionCard.classList.remove('flipped');
    }
    
    // 버튼 초기화
    const drawBtn = document.getElementById('draw-btn');
    const startBtn = document.getElementById('start-mission-btn');
    
    if (drawBtn) {
        drawBtn.style.display = 'inline-block';
        drawBtn.textContent = '🎰 키오스크 뽑기';
        drawBtn.disabled = false;
    }
    
    if (startBtn) {
        startBtn.style.display = 'none';
    }
}

// 랜덤 미션 뽑기
function drawRandomMission() {
    const drawBtn = document.getElementById('draw-btn');
    const missionCard = document.getElementById('mission-card');
    
    if (isCardFlipped) return;
    
    // 버튼 비활성화
    drawBtn.disabled = true;
    drawBtn.textContent = '🎲 뽑는 중...';
    
    // 랜덤 선택
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * kioskData.length);
        selectedKiosk = kioskData[randomIndex];
        
        // 카드 뒤면에 결과 표시
        const missionContent = document.getElementById('mission-content');
        missionContent.innerHTML = `
            <div class="mission-result-content">
                <div class="kiosk-icon" style="color: ${selectedKiosk.color};">
                    ${selectedKiosk.icon}
                </div>
                <h3 class="kiosk-name">${selectedKiosk.name}</h3>
                <p class="kiosk-description">${selectedKiosk.description}</p>
                <div class="mission-text">
                    <strong>미션:</strong><br>
                    ${selectedKiosk.mission}
                </div>
            </div>
        `;
        
        // 카드 뒤집기
        missionCard.classList.add('flipped');
        isCardFlipped = true;
        
        // 버튼 상태 변경
        drawBtn.style.display = 'none';
        document.getElementById('start-mission-btn').style.display = 'inline-block';
        
    }, 1500);
}

// 선택된 미션 시작
function startSelectedMission() {
    if (!selectedKiosk) return;
    
    // 키오스크 체험 페이지로 이동
    goToPage('page-kiosk-experience');
    
    // iframe에 키오스크 로드
    const iframe = document.getElementById('kiosk-iframe');
    const kioskName = document.getElementById('current-kiosk-name');
    const missionText = document.getElementById('current-mission-text');
    
    if (iframe) {
        iframe.src = selectedKiosk.url;
    }
    
    if (kioskName) {
        kioskName.textContent = selectedKiosk.name + ' 체험 중';
    }
    
    if (missionText) {
        missionText.textContent = selectedKiosk.mission;
    }
}

// 미션 도움말 표시
function showMissionHelp() {
    const helpModal = document.getElementById('help-modal');
    const currentKiosk = document.getElementById('help-current-kiosk');
    
    if (selectedKiosk && currentKiosk) {
        currentKiosk.textContent = selectedKiosk.name + ' - ' + selectedKiosk.mission;
    }
    
    if (helpModal) {
        helpModal.style.display = 'flex';
    }
}

// 도움말 모달 닫기
function closeHelpModal() {
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.style.display = 'none';
    }
}

// 체험 완료
function completeMissionExperience() {
    if (!selectedKiosk) return;
    
    // 완료 페이지로 이동
    goToPage('page-complete');
    
    // 완료 정보 표시
    const completedKioskName = document.getElementById('completed-kiosk-name');
    if (completedKioskName) {
        completedKioskName.textContent = selectedKiosk.name + ' 체험 완료!';
    }
}

// 초기화 함수
function init() {
    console.log('키오스크 체험관이 시작되었습니다.');
    resetSystem();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

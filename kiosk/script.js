// 키오스크 체험관 JavaScript - 랜덤 미션 시스템

// 버튼 클릭 핸들러 (가장 먼저 정의)
function handleStartClick() {
    console.log('handleStartClick 호출됨');
    if (typeof goToPage === 'function') {
        goToPage('page-mission');
    } else {
        console.error('goToPage 함수를 찾을 수 없습니다');
    }
}

// 전역 변수
let selectedKiosk = null;
let isCardFlipped = false;
let kioskWindow = null; // 키오스크 새 창 참조

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
    console.log('goToPage 호출됨:', pageId); // 디버깅용
    
    // 모든 페이지 숨기기
    const pages = document.querySelectorAll('.page');
    console.log('찾은 페이지들:', pages.length); // 디버깅용
    pages.forEach(page => page.classList.remove('active'));
    
    // 선택된 페이지 보이기
    const selectedPage = document.getElementById(pageId);
    console.log('선택된 페이지:', selectedPage); // 디버깅용
    if (selectedPage) {
        selectedPage.classList.add('active');
        console.log('페이지 활성화 완료:', pageId); // 디버깅용
    } else {
        console.error('페이지를 찾을 수 없음:', pageId); // 디버깅용
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
    kioskWindow = null; // 키오스크 창 참조 초기화
    
    // 미션 카드 초기화
    const missionCard = document.getElementById('mission-card');
    if (missionCard) {
        missionCard.classList.remove('flipped');
    }
    
    // 버튼 초기화
    const drawBtn = document.getElementById('draw-btn');
    const startBtn = document.getElementById('start-mission-btn');
    const openBtn = document.getElementById('open-kiosk-btn');
    const completeBtn = document.getElementById('complete-btn');
    
    if (drawBtn) {
        drawBtn.style.display = 'inline-block';
        drawBtn.textContent = '🎰 키오스크 뽑기';
        drawBtn.disabled = false;
    }
    
    if (startBtn) {
        startBtn.style.display = 'none';
    }
    
    if (openBtn) {
        openBtn.style.display = 'inline-block';
    }
    
    if (completeBtn) {
        completeBtn.style.display = 'none';
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
    
    // 미리보기 정보 업데이트
    const previewIcon = document.getElementById('preview-icon');
    const previewKioskName = document.getElementById('preview-kiosk-name');
    const previewMissionText = document.getElementById('preview-mission-text');
    const selectedKioskInfo = document.getElementById('selected-kiosk-info');
    
    if (previewIcon) {
        previewIcon.textContent = selectedKiosk.icon;
        previewIcon.style.color = selectedKiosk.color;
    }
    
    if (previewKioskName) {
        previewKioskName.textContent = selectedKiosk.name;
    }
    
    if (previewMissionText) {
        previewMissionText.textContent = selectedKiosk.mission;
    }
    
    if (selectedKioskInfo) {
        selectedKioskInfo.textContent = `${selectedKiosk.name}에서 체험을 진행해보세요`;
    }
}

// 새 창에서 키오스크 열기
function openKioskInNewWindow() {
    if (!selectedKiosk) return;
    
    // 새 창으로 키오스크 열기
    const windowFeatures = 'width=1200,height=800,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no';
    kioskWindow = window.open(selectedKiosk.url, '_blank', windowFeatures);
    
    // 버튼 상태 변경
    const openBtn = document.getElementById('open-kiosk-btn');
    const completeBtn = document.getElementById('complete-btn');
    
    if (openBtn) {
        openBtn.style.display = 'none';
    }
    
    if (completeBtn) {
        completeBtn.style.display = 'inline-block';
    }
    
    // 새 창이 닫혔는지 주기적으로 확인
    const checkClosed = setInterval(() => {
        if (kioskWindow && kioskWindow.closed) {
            clearInterval(checkClosed);
            // 창이 닫히면 버튼 상태 원래대로
            if (openBtn) openBtn.style.display = 'inline-block';
            if (completeBtn) completeBtn.style.display = 'none';
        }
    }, 1000);
}

// 미션 도움말 표시
function showMissionHelp() {
    const helpModal = document.getElementById('help-modal');
    const currentKiosk = document.getElementById('help-current-kiosk');
    
    if (selectedKiosk && currentKiosk) {
        currentKiosk.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <span style="font-size: 40px; color: ${selectedKiosk.color};">${selectedKiosk.icon}</span>
                <div>
                    <strong>${selectedKiosk.name}</strong><br>
                    <span style="color: #666;">${selectedKiosk.mission}</span>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <strong>체험 상태:</strong> ${kioskWindow && !kioskWindow.closed ? '키오스크 체험 중' : '체험 대기 중'}
            </div>
        `;
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
    
    // 전역 함수들을 window 객체에 명시적으로 등록
    window.goToPage = goToPage;
    window.handleStartClick = handleStartClick;
    window.drawRandomMission = drawRandomMission;
    window.startSelectedMission = startSelectedMission;
    window.openKioskInNewWindow = openKioskInNewWindow;
    window.completeMissionExperience = completeMissionExperience;
    window.showMissionHelp = showMissionHelp;
    window.closeHelpModal = closeHelpModal;
    
    console.log('모든 함수가 window 객체에 등록되었습니다.');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

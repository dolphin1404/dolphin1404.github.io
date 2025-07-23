// 스미싱 체험관 JavaScript

// 전역 변수
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedVote = '';

// 퀴즈 데이터 (스미싱 7개 + 정상 문자 2개)
const quizData = [
    {
        id: 1,
        type: '카드발급 사칭',
        message: '[KB국민카드] 신용카드 발급이 승인되었습니다. 카드수령을 위해 개인정보 확인이 필요합니다.',
        link: 'http://kb-crads.com/confirm',
        isPhishing: true,
        explanation: {
            title: '카드발급 사칭 스미싱',
            features: ['정식 도메인과 유사한 가짜 URL 사용', '긴급성을 강조하여 클릭 유도', '개인정보 입력 요구'],
            warning: '카드사는 문자로 개인정보를 요구하지 않습니다',
            action: '카드사 공식 앱이나 고객센터로 직접 확인'
        }
    },
    {
        id: 2,
        type: '정상 쿠팡 배송',
        message: '[쿠팡] 주문하신 상품이 배송 완료되었습니다. 배송조회: https://www.coupang.com/vp/orders',
        link: 'https://www.coupang.com/vp/orders',
        isPhishing: false,
        explanation: {
            title: '정상적인 쿠팡 배송 알림',
            features: ['공식 쿠팡 도메인(coupang.com) 사용', '개인정보 요구하지 않음', '단순 배송 완료 안내'],
            warning: '이것은 정상적인 배송 완료 알림입니다',
            action: '정상적인 문자입니다. 필요시 주문내역을 확인하세요'
        }
    },
    {
        id: 3,
        type: '법원 사칭',
        message: '[법원행정처] 민사소송 관련 출석통지서가 발송되었습니다. 확인하지 않으시면 패소될 수 있습니다.',
        link: 'http://court-notice.co.kr',
        isPhishing: true,
        explanation: {
            title: '법원 사칭 스미싱',
            features: ['공식기관 사칭으로 권위 이용', '법적 불이익 협박', '즉시 확인 압박'],
            warning: '법원은 공식 우편으로만 통지서를 발송합니다',
            action: '해당 법원에 직접 전화하여 확인'
        }
    },
    {
        id: 4,
        type: '정상 신한은행',
        message: '[신한은행] 고객님의 계좌에서 ATM 출금 500,000원이 처리되었습니다. 문의: 1599-8000',
        link: null,
        isPhishing: false,
        explanation: {
            title: '정상적인 신한은행 거래 알림',
            features: ['실제 은행 고객센터 번호 제공', '의심스러운 링크 없음', '단순 거래 내역 안내'],
            warning: '이것은 정상적인 거래 알림입니다',
            action: '정상적인 문자입니다. 거래 내역이 맞는지 확인하세요'
        }
    },
    {
        id: 5,
        type: '교통범칙금 사칭',
        message: '[경찰청] 과속 단속 범칙금 미납으로 인해 면허정지 예정입니다. 즉시 납부하세요.',
        link: 'http://efine-pay.kr',
        isPhishing: true,
        explanation: {
            title: '교통범칙금 사칭 스미싱',
            features: ['공권력 사칭으로 위압감 조성', '면허정지 등 불이익 경고', '즉시 결제 요구'],
            warning: '경찰청은 문자로 범칙금 납부를 요구하지 않습니다',
            action: '경찰서나 이파인(efine.go.kr)에서 직접 확인'
        }
    },
    {
        id: 6,
        type: '자녀 사칭',
        message: '엄마 폰 깨져서 친구폰으로 연락해요. 학원비 급하게 필요해서 계좌로 보내주세요. 010-****-****',
        link: null,
        isPhishing: true,
        explanation: {
            title: '자녀 사칭 스미싱',
            features: ['가족 관계 악용', '긴급상황 연출', '직접 통화 회피'],
            warning: '가족이라도 금전 요구 시 반드시 본인 확인 필요',
            action: '자녀에게 직접 전화하여 확인'
        }
    },
    {
        id: 7,
        type: '정부지원금 사칭',
        message: '[DB은행] 정부 민생소비쿠폰 신청 대상입니다. 고객님의 계좌 확인이 필요합니다. 아래 링크에서 인증 후 신청 바랍니다.',
        link: 'bit.ly/db-coupon',
        isPhishing: true,
        explanation: {
            title: '정부지원금 사칭 스미싱',
            features: ['링크 클릭이나 앱 설치 유도', '카드 번호와 비밀번호 요구', '전용 앱으로만 소비 쿠폰 신청이 가능한 것처럼 호도'],
            warning: '공식 안내 문자는 인터넷 링크 없음. 정부24나 카드사 홈페이지, 행정복지센터에서만 신청할 수 있고 신청 과정에서 카드번호와 비밀번호 요구하지 않음',
            action: '링크 접속이나 앱 설치했을 경우 금융기관에서 지급 정지, 통신사에서 소액결제 서비스 중단 신청'
        }
    },
    {
        id: 8,
        type: '청첩장 사칭',
        message: '[모바일 청첩장] 안녕하세요! 결혼하게 되었습니다. 꼭 참석해주세요♥',
        link: 'http://mcard.wedding-day.kr',
        isPhishing: true,
        explanation: {
            title: '청첩장 사칭 스미싱',
            features: ['감정적 호소로 경계심 해제', '모르는 사람도 클릭하게 유도', '악성코드 설치 목적'],
            warning: '모르는 번호의 청첩장 링크는 악성코드일 가능성 높음',
            action: '발신자가 누구인지 먼저 확인'
        }
    },
    {
        id: 9,
        type: '민생소비쿠폰 사칭',
        message: '[민생회복 소비쿠폰 안내] 신청 대상자이며 상담원이 곧 연락 드립니다. 신청을 원할 경우 원격 도우미 앱을 먼저 설치해주세요',
        link: 'support-app.kr',
        isPhishing: true,
        explanation: {
            title: '민생회복 소비쿠폰 사칭 스미싱',
            features: ['정부 정책 사칭으로 신뢰도 높임', '원격 도우미 앱 설치 유도', '상담원 연락 언급으로 긴급성 조성'],
            warning: '정부 소비쿠폰은 공식 앱에서만 신청 가능하며, 별도 앱 설치를 요구하지 않습니다',
            action: '정부24나 해당 지역 행정복지센터에서 직접 확인'
        }
    }
];

// 페이지 전환 함수
function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'page-quiz') {
        initQuiz();
    } else if (pageId === 'page-explanation') {
        showQuizResult();
    } else if (pageId === 'page-explanation-1') {
        showDetailedExplanations(1, 4);
    } else if (pageId === 'page-explanation-2') {
        showDetailedExplanations(5, 9);
    }
}

// 퀴즈 초기화
function initQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    updateQuizDisplay();
}

// 연락처 이름 생성
function getContactName(type) {
    const names = {
        '카드발급 사칭': 'KB국민카드',
        '정상 쿠팡 배송': '쿠팡',
        '법원 사칭': '법원행정처',
        '정상 신한은행': '신한은행',
        '교통범칙금 사칭': '경찰청',
        '자녀 사칭': '미지의 번호',
        '정부지원금 사칭': 'DB은행',
        '청첩장 사칭': '모바일 청첩장',
        '민생소비쿠폰 사칭': '정부지원센터'
    };
    return names[type] || '알 수 없는 발신자';
}

// 연락처 번호 생성
function getContactNumber(type) {
    const numbers = {
        '카드발급 사칭': '010-1234-5678',
        '정상 쿠팡 배송': '010-2345-6789',
        '법원 사칭': '010-3456-7890',
        '정상 신한은행': '010-4567-8901',
        '교통범칙금 사칭': '010-5678-9012',
        '자녀 사칭': '010-6789-0123',
        '정부지원금 사칭': '010-7890-1234',
        '청첩장 사칭': '010-8901-2345',
        '민생소비쿠폰 사칭': '010-9012-3456'
    };
    return numbers[type] || '010-0000-0000';
}

// 퀴즈 화면 업데이트 (간소화)
function updateQuizDisplay() {
    const question = quizData[currentQuestionIndex];
    const container = document.getElementById('quiz-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    container.innerHTML = `
        <!-- 문자 앱 헤더 -->
        <div class="message-header">
            <span class="back-arrow">←</span>
            <div class="contact-info">
                <p class="contact-name">${getContactName(question.type)}</p>
                <p class="contact-number">${getContactNumber(question.type)}</p>
            </div>
            <div class="header-icons">
                <span>📞</span>
                <span>🔍</span>
                <span>⋮</span>
            </div>
        </div>
        
        <!-- 메시지 영역 -->
        <div class="message-area">
            <!-- 받은 메시지 -->
            <div class="received-message">
                <div class="message-bubble received-bubble">
                    <p class="message-text">${question.message}</p>
                    ${question.link ? `<span class="message-link">${question.link}</span>` : ''}
                </div>
                <div class="message-time">오후 2:45</div>
            </div>
            
            <!-- 사용자가 보내는 퀴즈 메시지들 -->
            <div class="sent-message">
                <div class="message-bubble sent-bubble">
                    <p class="message-text">이 문자가 의심스러운데...</p>
                </div>
                <div class="message-time">오후 2:46</div>
            </div>
        </div>
        
        <!-- 입력 영역 (퀴즈 선택) -->
        <div class="input-area">
            <div class="compact-spacing">
                <button onclick="selectAnswer(true)" class="quiz-option w-full p-3 border-2 border-red-300 rounded text-left hover:bg-red-50 ${userAnswers[currentQuestionIndex] === true ? 'selected' : ''}">
                    <div class="flex items-center">
                        <span class="text-xl mr-3">🚨</span>
                        <div>
                            <p class="font-bold text-red-800 text-sm">스미싱이라고 생각해요</p>
                            <p class="text-red-600 text-xs">위험해 보여요</p>
                        </div>
                    </div>
                </button>
                
                <button onclick="selectAnswer(false)" class="quiz-option w-full p-3 border-2 border-green-300 rounded text-left hover:bg-green-50 ${userAnswers[currentQuestionIndex] === false ? 'selected' : ''}">
                    <div class="flex items-center">
                        <span class="text-xl mr-3">✅</span>
                        <div>
                            <p class="font-bold text-green-800 text-sm">안전한 문자 같아요</p>
                            <p class="text-green-600 text-xs">정상적인 것 같아요</p>
                        </div>
                    </div>
                </button>
            </div>
            
            <!-- 해설 영역 -->
            <div id="instant-explanation" style="display: none;"></div>
        </div>
    `;

    // 버튼 상태 업데이트
    prevBtn.disabled = currentQuestionIndex === 0;
    prevBtn.className = currentQuestionIndex === 0 ? 
        'flex-1 bg-gray-300 text-gray-500 font-bold rounded cursor-not-allowed' :
        'flex-1 bg-gray-300 text-gray-700 font-bold rounded hover:bg-gray-400 transition-all';

    // 다음 버튼 상태는 답을 선택했을 때만 활성화되도록 수정
    updateNextButton();
}

// 퀴즈 결과 요약 표시
function showQuizResult() {
    const container = document.getElementById('quiz-result-summary');
    let correctCount = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].isPhishing) {
            correctCount++;
        }
    });

    container.innerHTML = `
        <h3 class="font-bold text-blue-800 mb-2">퀴즈 결과</h3>
        <p class="font-bold text-blue-900 text-2xl mb-2">${correctCount} / ${quizData.length}</p>
        <p class="text-blue-700 text-sm">
            ${correctCount === quizData.length ? '완벽해요! 🎉' : 
              correctCount >= 5 ? '잘 하셨어요! 👏' : 
              '더 주의 깊게 살펴보세요 📚'}
        </p>
    `;

    // 퀴즈 결과를 구글폼에 전송
    submitQuizResultToGoogleForm(correctCount, userAnswers);
}

// 퀴즈 결과를 구글폼에 전송하는 함수
function submitQuizResultToGoogleForm(correctCount, answers) {
    // 구글 폼즈 URL (퀴즈 결과용)
    const QUIZ_RESULT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeb5kP0SD0ZwclXBRFJmB0hzewPGEyZBlzdsvGNezJsw8THGw/formResponse';
    
    // 현재 시간을 한국 시간으로 포맷
    const now = new Date();
    const koreaTime = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Seoul'
    }).format(now);

    // 답안을 문자열로 변환 (O/X 형태)
    const answerString = answers.map((answer, index) => {
        const isCorrect = answer === quizData[index].isPhishing;
        return isCorrect ? 'O' : 'X';
    }).join('');

    // 점수 등급
    const grade = correctCount === quizData.length ? '완벽' : 
                 correctCount >= 5 ? '우수' : '보통';

    // 각 문제별 정답 여부 (개별 필드로 전송)
    const q1_correct = answers[0] === quizData[0].isPhishing ? 'O' : 'X';
    const q2_correct = answers[1] === quizData[1].isPhishing ? 'O' : 'X';
    const q3_correct = answers[2] === quizData[2].isPhishing ? 'O' : 'X';
    const q4_correct = answers[3] === quizData[3].isPhishing ? 'O' : 'X';
    const q5_correct = answers[4] === quizData[4].isPhishing ? 'O' : 'X';
    const q6_correct = answers[5] === quizData[5].isPhishing ? 'O' : 'X';
    const q7_correct = answers[6] === quizData[6].isPhishing ? 'O' : 'X';
    const q8_correct = answers[7] === quizData[7].isPhishing ? 'O' : 'X';
    const q9_correct = answers[8] === quizData[8].isPhishing ? 'O' : 'X';

    // 구글 폼의 entry ID들 (퀴즈 결과용)
    const formData = new FormData();
    formData.append('entry.2003845403', correctCount.toString());  // 정답 개수 entry ID
    formData.append('entry.100037354', `${correctCount}/${quizData.length}`); // 점수 entry ID
    formData.append('entry.543937702', answerString);   // 상세 답안 entry ID
    formData.append('entry.797352681', grade);         // 등급 entry ID
    formData.append('entry.860581520', koreaTime);     // 완료 시간 entry ID
    // 각 문제별 정답 여부 (분석용)
    formData.append('entry.1705827725', q1_correct);    // 1번 문제 정답 여부
    formData.append('entry.2002706913', q2_correct);    // 2번 문제 정답 여부
    formData.append('entry.615492498', q3_correct);    // 3번 문제 정답 여부
    formData.append('entry.616665634', q4_correct);    // 4번 문제 정답 여부
    formData.append('entry.1207992116', q5_correct);    // 5번 문제 정답 여부
    formData.append('entry.2099508387', q6_correct);    // 6번 문제 정답 여부
    formData.append('entry.2050379907', q7_correct);    // 7번 문제 정답 여부
    formData.append('entry.1234567890', q8_correct);    // 8번 문제 정답 여부
    formData.append('entry.9876543210', q9_correct);    // 9번 문제 정답 여부

    console.log('퀴즈 결과 전송 데이터:', {
        정답개수: correctCount,
        점수: `${correctCount}/${quizData.length}`,
        상세답안: answerString,
        등급: grade,
        완료시간: koreaTime,
        문제별정답: {
            '1번_카드발급사칭': q1_correct,
            '2번_쿠팡배송': q2_correct,
            '3번_법원사칭': q3_correct,
            '4번_신한은행': q4_correct,
            '5번_교통범칙금사칭': q5_correct,
            '6번_자녀사칭': q6_correct,
            '7번_정부지원금사칭': q7_correct,
            '8번_청첩장사칭': q8_correct,
            '9번_민생소비쿠폰사칭': q9_correct
        }
    });

    // 구글 폼으로 퀴즈 결과 전송 (백그라운드에서 실행)
    fetch(QUIZ_RESULT_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        console.log('퀴즈 결과가 성공적으로 전송되었습니다.');
    }).catch((error) => {
        console.error('퀴즈 결과 전송 오류:', error);
    });
}

// 상세 해설 표시 (페이지별로 분할)
function showDetailedExplanations(startIndex, endIndex) {
    const containerId = startIndex === 1 ? 'explanation-content-1' : 'explanation-content-2';
    const container = document.getElementById(containerId);
    let explanationHtml = '';

    // 첫 번째 페이지에만 결과 요약 표시
    if (startIndex === 1) {
        let correctCount = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].isPhishing) {
                correctCount++;
            }
        });

        explanationHtml += `
            <div class="bg-blue-50 border-2 border-blue-200 rounded p-compact text-center mb-compact">
                <h3 class="font-bold text-blue-800 text-sm mb-1">퀴즈 결과</h3>
                <p class="font-bold text-blue-900 text-2xl mb-1">${correctCount} / ${quizData.length}</p>
                <p class="text-blue-700 text-xs">
                    ${correctCount === quizData.length ? '완벽해요! 🎉' : 
                      correctCount >= 5 ? '잘 하셨어요! 👏' : 
                      '더 주의 깊게 살펴보세요 📚'}
                </p>
            </div>
        `;
    }

    for (let i = startIndex - 1; i < endIndex; i++) {
        const question = quizData[i];
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === question.isPhishing;
        const explanation = question.explanation;
        const isNormalMessage = !question.isPhishing;

        explanationHtml += `
            <div class="border-2 rounded p-compact mb-compact ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">${isCorrect ? '✅' : '❌'}</span>
                    <h3 class="font-bold text-sm">${i + 1}. ${explanation.title}</h3>
                </div>
                
                <div class="bg-white rounded p-2 mb-2 border text-xs">
                    <p class="text-gray-800">${question.message}</p>
                    ${question.link ? `<p class="text-blue-600 mt-1 break-all font-bold">${question.link}</p>` : ''}
                </div>

                <div class="text-xs space-y-1">
                    <div>
                        <h4 class="font-bold mb-1">${isNormalMessage ? '🔍 정상 신호' : '🔍 특징'}</h4>
                        <ul class="${isNormalMessage ? 'text-green-700' : 'text-gray-700'} space-y-1">
                            ${explanation.features.map(feature => `<li class="flex items-start"><span class="mr-1">•</span><span>${feature}</span></li>`).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <p class="${isNormalMessage ? 'text-green-700' : 'text-red-700'}">${explanation.warning}</p>
                    </div>
                    
                    ${!isNormalMessage ? `
                    <div>
                        <h4 class="font-bold mb-1">✅ 대처법</h4>
                        <p class="text-green-700">${explanation.action}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    container.innerHTML = explanationHtml;
}

// 다음 버튼 상태 업데이트
function updateNextButton() {
    const nextBtn = document.getElementById('next-btn');
    const hasAnswer = userAnswers[currentQuestionIndex] !== undefined;
    
    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.textContent = '결과 보기';
        nextBtn.className = hasAnswer ? 
            'flex-1 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-all' :
            'flex-1 bg-gray-400 text-gray-200 font-bold rounded cursor-not-allowed';
        nextBtn.disabled = !hasAnswer;
        if (hasAnswer) {
            nextBtn.onclick = () => {
                const hasShownFeedback = document.getElementById('instant-explanation').style.display === 'block';
                const userAnswer = userAnswers[currentQuestionIndex];
                const isCorrect = userAnswer === quizData[currentQuestionIndex].isPhishing;
                
                if (!hasShownFeedback && !isCorrect) {
                    // 틀린 답일 때만 피드백 표시
                    showQuestionFeedback();
                    
                    // 1.5초 후 버튼 상태 변경
                    nextBtn.disabled = true;
                    nextBtn.className = 'flex-1 bg-gray-400 text-gray-200 font-bold rounded cursor-not-allowed';
                    nextBtn.textContent = '피드백 확인 중...';
                    
                    setTimeout(() => {
                        nextBtn.disabled = false;
                        nextBtn.className = 'flex-1 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-all';
                        nextBtn.textContent = '결과 페이지로 →';
                        nextBtn.onclick = () => goToPage('page-explanation');
                    }, 1500);
                } else {
                    // 정답이거나 이미 피드백을 본 경우 바로 결과 페이지로
                    goToPage('page-explanation');
                }
            };
        } else {
            nextBtn.onclick = null;
        }
    } else {
        nextBtn.textContent = '다음 →';
        nextBtn.className = hasAnswer ? 
            'flex-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-all' :
            'flex-1 bg-gray-400 text-gray-200 font-bold rounded cursor-not-allowed';
        nextBtn.disabled = !hasAnswer;
        if (hasAnswer) {
            nextBtn.onclick = () => {
                const hasShownFeedback = document.getElementById('instant-explanation').style.display === 'block';
                const userAnswer = userAnswers[currentQuestionIndex];
                const isCorrect = userAnswer === quizData[currentQuestionIndex].isPhishing;
                
                if (!hasShownFeedback && !isCorrect) {
                    // 틀린 답일 때만 피드백 표시
                    showQuestionFeedback();
                    
                    // 1.5초 후 버튼 상태 변경
                    nextBtn.disabled = true;
                    nextBtn.className = 'flex-1 bg-gray-400 text-gray-200 font-bold rounded cursor-not-allowed';
                    nextBtn.textContent = '피드백 확인 중...';
                    
                    setTimeout(() => {
                        nextBtn.disabled = false;
                        nextBtn.className = 'flex-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-all';
                        nextBtn.textContent = '다음 문제로 →';
                        nextBtn.onclick = () => {
                            currentQuestionIndex++;
                            updateQuizDisplay();
                        };
                    }, 1500);
                } else {
                    // 정답이거나 이미 피드백을 본 경우 바로 다음 문제로
                    currentQuestionIndex++;
                    updateQuizDisplay();
                }
            };
        } else {
            nextBtn.onclick = null;
        }
    }
}

// 답안 선택
function selectAnswer(isPhishing) {
    // 답안 저장
    userAnswers[currentQuestionIndex] = isPhishing;
    
    // 화면 업데이트 (버튼 상태 등)
    updateQuizDisplay();
}

// 틀렸을 때 즉각적인 피드백 (진동 + 해설)
function showInstantFeedback(question) {
    const messageArea = document.querySelector('.message-area');
    const explanationDiv = document.getElementById('instant-explanation');
    
    // 정상 문자인지 스미싱인지 확인
    const isNormalMessage = !question.isPhishing;
    
    if (isNormalMessage) {
        // 정상 문자에 대한 피드백
        explanationDiv.innerHTML = `
            <div class="explanation-box">
                <div class="flex items-center mb-3">
                    <span class="text-2xl mr-2">✅</span>
                    <h4 class="font-bold text-green-800">이것은 스미싱이 아닙니다!</h4>
                </div>
                
                <div class="text-xs space-y-2">
                    <div>
                        <h5 class="font-bold mb-1 text-green-700">🔍 정상 신호:</h5>
                        <ul class="text-green-600 space-y-1">
                            ${question.explanation.features.map(feature => 
                                `<li class="flex items-start"><span class="mr-1">•</span><span>${feature}</span></li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="bg-green-100 border border-green-300 rounded p-2">
                        <p class="text-green-700">${question.explanation.warning}</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 스미싱에 대한 기존 피드백
        // 진동 효과 - 메시지 영역에 적용
        if (messageArea) {
            messageArea.classList.add('shake');
            setTimeout(() => {
                messageArea.classList.remove('shake');
            }, 600);
        }
        
        // 해설 표시
        explanationDiv.innerHTML = `
            <div class="explanation-box">
                <div class="flex items-center mb-3">
                    <span class="text-2xl mr-2">⚠️</span>
                    <h4 class="font-bold text-red-800">이것은 스미싱입니다!</h4>
                </div>
                
                <div class="text-xs space-y-2">
                    <div>
                        <h5 class="font-bold mb-1 text-red-700">🔍 위험 신호:</h5>
                        <ul class="text-red-600 space-y-1">
                            ${question.explanation.features.map(feature => 
                                `<li class="flex items-start"><span class="mr-1">•</span><span>${feature}</span></li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="bg-red-100 border border-red-300 rounded p-2">
                        <h5 class="font-bold mb-1 text-red-800">⚠️ 주의:</h5>
                        <p class="text-red-700">${question.explanation.warning}</p>
                    </div>
                    
                    <div class="bg-green-100 border border-green-300 rounded p-2">
                        <h5 class="font-bold mb-1 text-green-800">✅ 올바른 대처:</h5>
                        <p class="text-green-700">${question.explanation.action}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    explanationDiv.style.display = 'block';
}

// 맞았을 때 간단한 피드백
function showCorrectFeedback() {
    const explanationDiv = document.getElementById('instant-explanation');
    
    explanationDiv.innerHTML = `
        <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3 mt-4">
            <div class="flex items-center justify-center">
                <span class="text-2xl mr-2">✅</span>
                <p class="font-bold text-green-800">정답입니다! 훌륭해요!</p>
            </div>
        </div>
    `;
    
    explanationDiv.style.display = 'block';
}

// 다음 문제 (단순화된 버전)
function nextQuestion() {
    // 이 함수는 더 이상 직접 사용되지 않음
    // updateNextButton에서 onclick을 동적으로 설정함
    console.log('nextQuestion called directly - should not happen');
}

// 문제별 피드백 표시
function showQuestionFeedback() {
    const question = quizData[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const isCorrect = userAnswer === question.isPhishing;
    
    console.log('showQuestionFeedback called:', {
        questionIndex: currentQuestionIndex,
        userAnswer: userAnswer,
        correctAnswer: question.isPhishing,
        isCorrect: isCorrect
    });
    
    if (!isCorrect) {
        console.log('Showing instant feedback for wrong answer');
        showInstantFeedback(question);
    } else {
        console.log('Correct answer - moving to next question immediately');
        // 정답일 경우 바로 다음 문제로 이동
        if (currentQuestionIndex === quizData.length - 1) {
            // 마지막 문제인 경우 결과 페이지로
            goToPage('page-explanation');
        } else {
            // 다음 문제로 이동
            currentQuestionIndex++;
            updateQuizDisplay();
        }
    }
}

// 이전 문제
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuizDisplay();
    }
}

// 해설 페이지 표시
function showExplanations() {
    // 이 함수는 더 이상 사용하지 않음 (페이지 분할됨)
}

// 투표 선택
function selectVote(vote) {
    selectedVote = vote;
    
    // 모든 투표 옵션 초기화
    document.querySelectorAll('.vote-option').forEach(option => {
        option.classList.remove('bg-green-100', 'bg-yellow-100', 'bg-red-100');
        option.classList.remove('border-green-500', 'border-yellow-500', 'border-red-500');
    });
    
    // 선택된 옵션 강조
    event.target.closest('.vote-option').classList.add(
        vote === 'confident' ? 'bg-green-100' : 
        vote === 'moderate' ? 'bg-yellow-100' : 'bg-red-100'
    );
    event.target.closest('.vote-option').classList.add(
        vote === 'confident' ? 'border-green-500' : 
        vote === 'moderate' ? 'border-yellow-500' : 'border-red-500'
    );
    
    // 잠시 후 완료 페이지로 이동 (만족도 조사는 기프티콘 신청 시에만 전송)
    setTimeout(() => {
        goToPage('page-complete');
        showCompletionMessage();
    }, 1000);
}

// 완료 메시지 표시
function showCompletionMessage() {
    const messageContainer = document.getElementById('completion-message');
    let message = '';
    
    switch(selectedVote) {
        case 'confident':
            message = `
                <div class="text-center">
                    <p class="text-lg font-bold text-green-800 mb-2">훌륭해요! 🎉</p>
                    <p class="text-green-700">지금처럼만 주의하시면 스미싱으로부터 안전하게 보호받을 수 있어요!</p>
                </div>
            `;
            break;
        case 'moderate':
            message = `
                <div class="text-center">
                    <p class="text-lg font-bold text-yellow-800 mb-2">좋은 자세예요! 👍</p>
                    <p class="text-yellow-700">조심스럽게 접근하는 습관을 계속 유지하시면 더욱 안전할 거예요!</p>
                </div>
            `;
            break;
        case 'unsure':
            message = `
                <div class="text-center">
                    <p class="text-lg font-bold text-blue-800 mb-2">괜찮아요! 💪</p>
                    <p class="text-blue-700">오늘 배운 내용을 기억하며 천천히 확인하는 습관을 기르시면 돼요!</p>
                </div>
            `;
            break;
        default:
            message = `
                <div class="text-center">
                    <p class="text-lg font-bold text-gray-800 mb-2">교육 완료! ✨</p>
                    <p class="text-gray-700">스미싱 예방 교육에 참여해주셔서 감사합니다!</p>
                </div>
            `;
    }
    
    messageContainer.innerHTML = message;
}

// 기프티콘 신청 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gifticon-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 폼 제출을 막음 - 팝업을 통해서만 제출 가능
        });
    }
});

// 개인정보 동의 팝업 표시
function showPrivacyModal() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    if (!name || !phone) {
        alert('이름과 휴대폰 번호를 먼저 입력해주세요.');
        return;
    }
    
    document.getElementById('privacy-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 개인정보 동의 팝업 닫기
function closePrivacyModal() {
    document.getElementById('privacy-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 복원
}

// 동의하고 신청하기
function agreeAndSubmit() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    if (name && phone) {
        // 팝업 닫기
        closePrivacyModal();
        
        // 구글 폼즈로 데이터 전송
        submitToGoogleForm(name, phone);
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('privacy-modal');
    if (e.target === modal) {
        closePrivacyModal();
    }
});

// 구글 폼즈로 데이터 전송
function submitToGoogleForm(name, phone) {
    // 로딩 상태 표시 - 팝업의 버튼을 찾음
    const submitBtn = document.querySelector('#privacy-modal button[onclick="agreeAndSubmit()"]');
    const originalText = submitBtn ? submitBtn.textContent : '동의하고 신청하기 🎁';
    
    if (submitBtn) {
        submitBtn.textContent = '전송 중...';
        submitBtn.disabled = true;
    }

    // 구글 폼즈 URL (실제 구글 폼 생성 후 여기에 입력)
    // 예시: 'https://docs.google.com/forms/d/e/1FAIpQLSe_ABC123DEF456_GHI789JKL/formResponse'
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd9LG6oOaQiDDX_xIi3e2wSIOlfEgo-_FvqGvmiBlSugPAoOQ/formResponse';
    
    // 현재 시간을 한국 시간으로 포맷
    const now = new Date();
    const koreaTime = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Seoul'
    }).format(now);
    
    // 만족도 결과를 한국어로 변환
    const surveyResult = selectedVote === 'confident' ? '자신 있어요' : 
                       selectedVote === 'moderate' ? '어느 정도 자신 있어요' : 
                       selectedVote === 'unsure' ? '아직 자신이 없어요' : '미선택';
    
    // 구글 폼의 entry ID들 (실제 구글 폼 생성 후 여기에 입력)
    const formData = new FormData();
    formData.append('entry.1530675882', name);     // 이름 필드 entry ID
    formData.append('entry.1998518792', phone);    // 휴대폰 번호 필드 entry ID
    formData.append('entry.1393168381', koreaTime); // 제출 시간 필드 entry ID (선택사항)
    formData.append('entry.1575475291', surveyResult); // 만족도 조사 결과 entry ID (한국어)

    console.log('전송할 데이터:', {
        이름: name,
        휴대폰: phone,
        제출시간: koreaTime,
        만족도: surveyResult
    });

    // 구글 폼으로 데이터 전송
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        // 성공 처리
        alert('기프티콘 신청이 완료되었습니다!\n1일 내로 문자로 발송될 예정입니다.');
        document.getElementById('gifticon-form').reset();
        
        // 버튼 상태 복원
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }).catch((error) => {
        // 오류 처리
        console.error('전송 오류:', error);
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        
        // 버튼 상태 복원
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

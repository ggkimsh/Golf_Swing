// 로컬 스토리지 키
const STORAGE_KEY = 'golfSwingChecklist';

// 기본 체크리스트 항목
const defaultChecklist = {
    address: [
        '발의 위치가 어깨 너비만큼 벌어져 있는가',
        '무게 중심이 발 중앙에 있는가',
        '척추 각도가 올바른가',
        '그립이 올바른가'
    ],
    backswing: [
        '테이크어웨이가 낮고 천천히 이루어지는가',
        '왼팔이 곧게 펴져있는가',
        '오른팔 각도가 적절한가',
        '머리가 고정되어 있는가'
    ],
    downswing: [
        '하체부터 움직임이 시작되는가',
        '팔이 몸에 붙어있는가',
        '손목 코킹이 유지되는가',
        '체중 이동이 올바른가'
    ],
    impact: [
        '시선이 볼에 고정되어 있는가',
        '손목이 릴리스 되는가',
        '체중이 왼발로 이동했는가',
        '클럽페이스가 스퀘어한가'
    ],
    followthrough: [
        '팔이 자연스럽게 따라가는가',
        '체중이 왼발에 완전히 이동했는가',
        '피니시 자세가 안정적인가',
        '균형이 잘 잡혀있는가'
    ]
};

// 상태 관리
let state = {
    address: [],
    backswing: [],
    downswing: [],
    impact: [],
    followthrough: []
};

// 로컬 스토리지에서 데이터 로드
function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
    } else {
        state = defaultChecklist;
        saveToStorage();
    }
}

// 로컬 스토리지에 데이터 저장
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 체크리스트 아이템 생성
function createChecklistItem(text, phase, index) {
    const item = document.createElement('div');
    item.className = 'checklist-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${phase}-${index}`;
    
    const label = document.createElement('label');
    label.htmlFor = `${phase}-${index}`;
    label.textContent = text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.onclick = () => {
        state[phase].splice(index, 1);
        saveToStorage();
        renderChecklist();
    };
    
    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteBtn);
    
    return item;
}

// 체크리스트 렌더링
function renderChecklist() {
    Object.keys(state).forEach(phase => {
        const container = document.getElementById(`${phase}-checklist`);
        container.innerHTML = '';
        
        state[phase].forEach((text, index) => {
            const item = createChecklistItem(text, phase, index);
            container.appendChild(item);
        });
    });
}

// 새 항목 추가
function addNewItem() {
    const input = document.getElementById('new-item-input');
    const select = document.getElementById('phase-select');
    
    const text = input.value.trim();
    const phase = select.value;
    
    if (text) {
        state[phase].push(text);
        saveToStorage();
        renderChecklist();
        input.value = '';
    }
}

// 비디오 컨트롤 함수
let isSlowMotion = true;
let isLooping = true;

function togglePlaybackSpeed() {
    const video = document.getElementById('swing-video');
    const speedBtn = document.getElementById('playback-speed');
    
    isSlowMotion = !isSlowMotion;
    video.playbackRate = isSlowMotion ? 0.25 : 1.0;
    speedBtn.textContent = `재생 속도: ${isSlowMotion ? '0.25x' : '1.0x'}`;
}

function toggleLooping() {
    const video = document.getElementById('swing-video');
    const loopBtn = document.getElementById('loop-toggle');
    
    isLooping = !isLooping;
    video.loop = isLooping;
    loopBtn.textContent = `반복 재생: ${isLooping ? 'ON' : 'OFF'}`;
}

// 비디오 초기화
function initializeVideo() {
    const video = document.getElementById('swing-video');
    if (video) {
        video.playbackRate = 0.25;
        video.loop = true;
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderChecklist();
    initializeVideo();
    
    const addButton = document.getElementById('add-item-btn');
    addButton.addEventListener('click', addNewItem);
    
    const input = document.getElementById('new-item-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewItem();
        }
    });
}); 
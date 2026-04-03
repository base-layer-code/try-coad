// 状態管理
let memos = [];
let activeMemoId = null;

const patterns = {
    num: { regex: /[0-9０-９]/g, label: "数字" },
    sym: { regex: /[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]|[！-／：-＠［-｀｛-｝]|[\u2000-\u206F\u2500-\u257F\u25A0-\u25FF\u2190-\u21FF\u2200-\u22FF\u2600-\u26FF\u3000-\u303F]/g, label: "記号" },
    roma: { regex: /[a-zA-Z]/g, label: "ローマ字" },
    jp: { regex: /[ぁ-んァ-ヶー一-龠]/g, label: "日本語" },
    kan: { regex: /[一-龠]/g, label: "漢字" },
    hira: { regex: /[ぁ-ん]/g, label: "ひらがな" }
};

window.onload = () => {
    const saved = localStorage.getItem('ultimate_memo_data');
    if (saved) {
        memos = JSON.parse(saved);
        activeMemoId = memos[0].id;
    } else {
        createNewMemo();
    }
    renderTabs();
    loadActiveMemo();
};

function createNewMemo() {
    const id = Date.now();
    const newMemo = { id, title: "新規メモ", content: "", history: [], undoStack: [], redoStack: [] };
    memos.push(newMemo);
    activeMemoId = id;
    renderTabs();
    loadActiveMemo();
    autoSave();
}

function loadActiveMemo() {
    const memo = memos.find(m => m.id === activeMemoId);
    if(!memo) return;
    document.getElementById('editor').value = memo.content;
    document.getElementById('memo-title').value = memo.title;
    updateHistoryUI();
    updateCtrlButtons();
}

function renderTabs() {
    const bar = document.getElementById('tabs-bar');
    const addButton = bar.querySelector('.btn-add-tab');
    bar.querySelectorAll('.tab').forEach(t => t.remove());
    memos.forEach(memo => {
        const tab = document.createElement('div');
        tab.className = `tab ${memo.id === activeMemoId ? 'active' : ''}`;
        tab.onclick = () => switchMemo(memo.id);
        tab.innerHTML = `<span>${memo.title || '無題'}</span><button class="btn-close-tab" onclick="closeTab(event, ${memo.id})">×</button>`;
        bar.insertBefore(tab, addButton);
    });
}

function switchMemo(id) { activeMemoId = id; renderTabs(); loadActiveMemo(); }

function closeTab(e, id) {
    e.stopPropagation();
    if (memos.length === 1) return;
    memos = memos.filter(m => m.id !== id);
    if (activeMemoId === id) activeMemoId = memos[0].id;
    renderTabs(); loadActiveMemo(); autoSave();
}

function updateTabTitle() {
    const memo = memos.find(m => m.id === activeMemoId);
    memo.title = document.getElementById('memo-title').value;
    renderTabs(); autoSave();
}

function autoSave() {
    const memo = memos.find(m => m.id === activeMemoId);
    if(!memo) return;
    memo.content = document.getElementById('editor').value;
    localStorage.setItem('ultimate_memo_data', JSON.stringify(memos));
    const status = document.getElementById('save-status');
    status.innerText = "保存中...";
    setTimeout(() => { status.innerText = "保存済み"; }, 800);
}

// --- ダウンロード関数（ここが重要！） ---
function download(type) {
    const memo = memos.find(m => m.id === activeMemoId);
    if (!memo) return;

    let content = type === 'text' ? memo.content : "■ 履歴\n" + memo.history.join("\n");
    let name = type === 'text' ? `${memo.title || '無題'}.txt` : "history.txt";
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    
    document.body.appendChild(a); // 必須：画面に追加
    a.click();                    // 実行
    document.body.removeChild(a); // 削除
    
    URL.revokeObjectURL(url);
}

// その他の関数（runReplace, runDelete, undo, redo, updateHistoryUI, updateCtrlButtons, loadFile）は
// 送っていただいた「統合メモ（途中）.txt」のものをそのまま main.js の末尾に貼り付けてください。

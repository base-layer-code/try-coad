// 1. ファイルを読み込んでエディタにセット
function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('editor').value = ev.target.result;
        runPreview(); // 読み込みと同時に実行
    };
    reader.readAsText(file);
}

// 2. 文字列を一括置換
function runReplace() {
    const findVal = document.getElementById('find-in').value;
    const replaceVal = document.getElementById('replace-in').value;
    const editor = document.getElementById('editor');
    
    if (!findVal) return alert("探す単語を入力してね");
    
    const newContent = editor.value.split(findVal).join(replaceVal);
    editor.value = newContent;
    runPreview(); // 書き換え後に反映
}

// 3. プレビュー実行 (iframeへの書き込み)
function runPreview() {
    const code = document.getElementById('editor').value;
    const previewFrame = document.getElementById('preview');
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    
    previewDoc.open();
    previewDoc.write(code);
    previewDoc.close();
}

function toggleFullScreen() {
    const preview = document.getElementById('preview');
    // iPad/iPhoneのSafari向けには webkitRequestFullscreen を優先的に試す
    if (preview.webkitRequestFullscreen) {
        preview.webkitRequestFullscreen();
    } else if (preview.requestFullscreen) {
        preview.requestFullscreen();
    }
}


// 5. ショートカットキー (Ctrl + S) で実行
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        runPreview();
    }
});

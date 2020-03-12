function changeColor(status) {
    switch(status) {
        case 'シラフ':
            document.getElementById('body').style.backgroundColor = '#ffffff';
            break;
        case '爽快期':
            document.getElementById('body').style.backgroundColor = '#48f945';
            alert("test");
            break;
        case 'ほろ酔い期':
            document.getElementById('body').style.backgroundColor = '#a4fc00';
            break;
        case '酩酊初期':
            document.getElementById('body').style.backgroundColor = '#fcfc00';
            break;
        case '酩酊極期':
            document.getElementById('body').style.backgroundColor = '#fcb000';
            break;
        case '泥酔期':
            document.getElementById('body').style.backgroundColor = '#ff0000';
            break;
        case '昏睡期':
            document.getElementById('body').style.backgroundColor = '#ff0000';
            break;
    }
}
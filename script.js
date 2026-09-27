// ===================================
// PLAYER DATA
// ===================================

let score =
  Number(localStorage.getItem("score")) || 0;


let hp =
  Number(localStorage.getItem("hp"));


if (!Number.isFinite(hp)) {
  hp = 100;
}



// ===================================
// QUEST DATA
// ===================================

let quests =
  JSON.parse(
    localStorage.getItem("quests")
  ) || [];


let weekOffset = 0;



// ===================================
// CLEAR STREAK
// ===================================

let clearStreak =
  Number(
    localStorage.getItem("clearStreak")
  ) || 0;


const savedStreakDate =
  localStorage.getItem(
    "clearStreakDate"
  );



// ===================================
// OPERATORS
// ===================================

const operators = [

  // =================================
  // OPERATOR 01
  // =================================

  {
    name: "OPERATOR 01",

    images: {
      normal: "images/op1-normal.png",
      happy: "images/op1-happy.png",
      serious: "images/op1-serious.png",
      casual: "images/op1-casual.png"
    },

    messages: {

      morning: [
        "おはよう。今日の予定、まず確認しておこうか。",
        "朝から来たんだ。いいスタートじゃない？"
      ],

      afternoon: [
        "午後の任務も、焦らず一つずつ片付けよ。",
        "まだ時間はあるよ。順番に進めれば大丈夫。"
      ],

      night: [
        "もう夜だね。残ってる任務だけ確認しておこっか。",
        "遅くまでお疲れさま。無理はしすぎないようにね。"
      ],

      daily: [
        "今日も来たね。じゃあ一日、始めようか。",
        "本日のシステム起動。今日もよろしく。"
      ],

      add: [
        "新しい任務ね。ちゃんと予定に入れておいたよ。",
        "了解。任務追加っと。忘れないようにね。"
      ],

      success: [
        "お見事。ちゃんと終わらせたね。",
        "いい感じ。その調子で進めよ。"
      ],

      streak: [
        "連続クリアじゃん。今日はかなり調子いいね。",
        "また達成？ふふ、今日はやる気あるじゃん。"
      ],

      fail: [
        "今回はうまくいかなかったね。でも次で取り返せばいいよ。",
        "失敗は確認。次の作戦に切り替えよっか。"
      ],

      complete: [
        "本日の任務、全件完了。……なかなかやるじゃん。",
        "全部終わったね。今日は胸を張っていいよ。"
      ],

      levelUp: [
        "LEVEL UP。ちゃんと積み重ねてるね。",
        "レベルが上がったよ。努力した分、ちゃんと数字に出てるね。"
      ],

      half: [
        "半分くらい終わったね。いいペース。",
        "ここまで順調。後半もこの調子でいこ。"
      ],

      almost: [
        "あと少しだよ。ここまで来たなら終わらせちゃおっか。",
        "ほぼ完了。最後までいけそうだね。"
      ],

      noQuest: [
        "今日はまだ任務なし。予定を入れるなら今のうちだよ。",
        "今のところ予定なし。少しのんびりできそうだね。"
      ],

      lowHp: [
        "HPがかなり減ってる。今日は無理しすぎないこと。"
      ],

      talk: [
        "どうしたの？ちゃんと見てるよ。",
        "呼んだ？……まあ、少しくらいなら付き合うよ。",
        "任務じゃない話でもする？"
      ]

    }
  },



  // =================================
  // OPERATOR 02
  // =================================

  {
    name: "OPERATOR 02",

    images: {
      normal: "images/op2-normal.png",
      happy: "images/op2-happy.png",
      serious: "images/op2-serious.png",
      casual: "images/op2-casual.png"
    },

    messages: {

      morning: [
        "おはよ。ちゃんと起きてるじゃん。",
        "朝から予定確認してるの？えらいじゃん。"
      ],

      afternoon: [
        "午後もまだあるね。ちゃんと続けよ。",
        "ここからサボらないでよ？"
      ],

      night: [
        "もう夜じゃん。残ってるのだけ確認しよ。",
        "今日も結構頑張ったんじゃない？"
      ],

      daily: [
        "今日も来たんだ。じゃ、今日もよろしく。",
        "お、起動した。今日もちゃんとやるんでしょ？"
      ],

      add: [
        "また予定増やしたんだ。ちゃんとやってよね。",
        "追加ね。忘れないようにしなよ？"
      ],

      success: [
        "やったね。ちゃんとできると思ってたよ。",
        "お、クリア！結構いい感じじゃん。"
      ],

      streak: [
        "またクリア！？今日はちゃんとしてるじゃん。",
        "連続じゃん。ちょっと見直したかも。"
      ],

      fail: [
        "んー、今日はダメだったか。でも次はちゃんとやろ？",
        "まあ一回くらい大丈夫。次で取り返そ。"
      ],

      complete: [
        "全部終わったの？すご。今日はもうゆっくりしていいんじゃない？",
        "全任務クリア！……ちゃんとやるじゃん。"
      ],

      levelUp: [
        "レベル上がったじゃん。結構やるね。",
        "LEVEL UP！ちゃんと強くなってるじゃん。"
      ],

      half: [
        "半分終わったね。あと半分。",
        "結構進んでるじゃん。いい感じ。"
      ],

      almost: [
        "あとちょっとじゃん。ここでやめないでよ？",
        "もうほぼ終わり。最後までやっちゃお。"
      ],

      noQuest: [
        "今日予定ないの？珍しいじゃん。",
        "クエストゼロ。今日は休み？"
      ],

      lowHp: [
        "HP低いよ。ちょっと休んだ方がいいんじゃない？"
      ],

      talk: [
        "なに？呼んだ？",
        "どうしたの？暇なの？",
        "ちゃんと任務もやってよね。"
      ]

    }
  },



  // =================================
  // OPERATOR 03
  // =================================

  {
    name: "OPERATOR 03",

    images: {
      normal: "images/op3-normal.png",
      happy: "images/op3-happy.png",
      serious: "images/op3-serious.png",
      casual: "images/op3-casual.png"
    },

    messages: {

      morning: [
        "おはよう。まず今日の予定を確認しよう。",
        "朝のうちに優先順位を決めておくと楽だよ。"
      ],

      afternoon: [
        "午後も焦らず進めよう。まだ十分時間あるよ。",
        "ここから集中が切れやすいから、一つずつね。"
      ],

      night: [
        "夜になったね。残りを確認して、無理なら調整しよ。",
        "今日やるべきことだけ終わらせれば十分だよ。"
      ],

      daily: [
        "今日も始めよっか。まず予定を確認しよう。",
        "おはよう。今日も一日、うまく進めていこう。"
      ],

      add: [
        "予定追加ね。無理のない量かだけ確認しておいて。",
        "了解。新しい任務、予定に入ったよ。"
      ],

      success: [
        "いいじゃん。その調子。ちゃんと積み上がってるよ。",
        "ナイス。今のペースなら十分。"
      ],

      streak: [
        "連続で終わらせてるね。かなりいい流れ。",
        "調子いいじゃん。このまま集中を切らさずいこ。"
      ],

      fail: [
        "まあ、こういう日もある。でも次に引きずるのはなしね。",
        "失敗は失敗。それで終わり。次に切り替えよ。"
      ],

      complete: [
        "全部完了。よく頑張ったね。今日は合格。",
        "全任務クリア。ちゃんと最後までやったじゃん。"
      ],

      levelUp: [
        "LEVEL UP。努力が数字に出てきたね。",
        "レベルアップだね。この積み重ねを続けていこう。"
      ],

      half: [
        "半分まで来たね。このペースなら大丈夫。",
        "いい進み方してるよ。あと半分。"
      ],

      almost: [
        "あと少し。ここまで来たら最後までいこ。",
        "ほぼ完了だね。ラスト一踏ん張り。"
      ],

      noQuest: [
        "今日は予定なしだね。休む日にするのも大事だよ。",
        "クエストはないみたい。必要なら今のうちに予定を立てよ。"
      ],

      lowHp: [
        "ちょっと頑張りすぎ。今日は負荷を下げてもいいんじゃない？"
      ],

      talk: [
        "どうした？何か相談？",
        "ちゃんと進んでる？困ったら一回整理しよ。",
        "休憩も予定のうちだからね。"
      ]

    }
  },



  // =================================
  // OPERATOR 04
  // =================================

  {
    name: "OPERATOR 04",

    images: {
      normal: "images/op4-normal.png",
      happy: "images/op4-happy.png",
      serious: "images/op4-serious.png",
      casual: "images/op4-casual.png"
    },

    messages: {

      morning: [
        "おはよー！今日も任務始めますか！",
        "朝だぞー！XP稼ぎに行こーぜ！"
      ],

      afternoon: [
        "午後戦スタート！まだまだいけるでしょ！",
        "さあ後半戦！ここからですよー！"
      ],

      night: [
        "夜になりましたー！残り何個だー？",
        "今日も終盤戦！あとちょっと頑張る？"
      ],

      daily: [
        "はい本日のLife Gameスタートー！",
        "今日も来たね！さーて何からやる？"
      ],

      add: [
        "任務追加！逃げ道なくなりましたー！笑",
        "お、新しいクエスト！ちゃんとクリアしてね！"
      ],

      success: [
        "よっしゃー！ナイス！今日は調子いいじゃん！",
        "おお！やるじゃん！そのまま行こ！"
      ],

      streak: [
        "連続クリアきたー！今日つよ！",
        "また！？めっちゃ調子いいじゃん笑"
      ],

      fail: [
        "あちゃー、やっちゃったね。でもまあ次いこ次！",
        "ドンマイドンマイ！一個失敗したくらいで終わらんよ！"
      ],

      complete: [
        "全クリきたー！今日はもう勝ちでしょ！",
        "全部終わった！？強すぎ笑 お疲れ！"
      ],

      levelUp: [
        "レベルアップきたー！いいじゃん！",
        "LEVEL UP！また一段強くなったね！"
      ],

      half: [
        "半分クリア！折り返し地点でーす！",
        "お、結構進んでんじゃん！"
      ],

      almost: [
        "あとちょっと！ここで逃げるのは禁止ね笑",
        "ほぼ終わりじゃん！全部やっちゃえ！"
      ],

      noQuest: [
        "え、今日クエストないの！？休日！？",
        "予定ゼロ！これは自由時間きたか？"
      ],

      lowHp: [
        "おーい、ボロボロじゃん笑 今日はちょい休み入れよ。"
      ],

      talk: [
        "なになに？呼んだ？笑",
        "暇ならクエストやろーぜ！",
        "クリックしてもXPは増えませーん笑"
      ]

    }
  },



  // =================================
  // OPERATOR 05
  // =================================

  {
    name: "OPERATOR 05",

    images: {
      normal: "images/op5-normal.png",
      happy: "images/op5-happy.png",
      serious: "images/op5-serious.png",
      casual: "images/op5-casual.png"
    },

    messages: {

      morning: [
        "おはよ。ちゃんと起きたんだ笑",
        "朝から来てるじゃん。今日はやる気ある？"
      ],

      afternoon: [
        "午後だけどまだいけるよね？",
        "ここからサボったらダメだからね。"
      ],

      night: [
        "もう夜じゃん。まだクエスト残ってる？",
        "夜までお疲れ。でも無理はしないでよね。"
      ],

      daily: [
        "今日も来たじゃん。ちゃんとやるんでしょ？",
        "Life Game起動！今日も頑張ってください笑"
      ],

      add: [
        "またクエスト増やしたの？自分で入れたんだからやってね笑",
        "はい追加ー。あとで忘れたとかなしね。"
      ],

      success: [
        "え、やるじゃん！ちょっと見直したかも笑",
        "ナイス！はい、ちゃんと褒めてあげます。"
      ],

      streak: [
        "え、またクリア？今日どうしたの笑",
        "連続じゃん！普通にすごくない？"
      ],

      fail: [
        "あーあ笑 でも次ちゃんとやればよくない？",
        "失敗じゃん！……まあ次頑張ればセーフ！"
      ],

      complete: [
        "全クリ！？今日はガチで偉いじゃん！",
        "え、全部終わったの？ちょっと強すぎない？"
      ],

      levelUp: [
        "え、レベル上がった！普通にすごくない？笑",
        "LEVEL UPじゃん！今日はちゃんと褒めてあげる笑"
      ],

      half: [
        "半分終わったじゃん。意外と早いね。",
        "結構進んでる。ちゃんとやってるじゃん。"
      ],

      almost: [
        "あとちょっと！ここまで来てやめないよね？",
        "もうすぐ全クリじゃん！早く終わらせよ。"
      ],

      noQuest: [
        "今日クエストないじゃん。暇人？笑",
        "予定ゼロだ。今日はゆっくりするの？"
      ],

      lowHp: [
        "HPやばくない？今日はちゃんと休んでよね。"
      ],

      talk: [
        "なにー？",
        "また押した笑",
        "私と話してないでクエストやったら？笑"
      ]

    }
  },



  // =================================
  // OPERATOR 06
  // =================================

  {
    name: "OPERATOR 06",

    images: {
      normal: "images/op6-normal.png",
      happy: "images/op6-happy.png",
      serious: "images/op6-serious.png",
      casual: "images/op6-casual.png"
    },

    messages: {

      morning: [
        "おはよう。今日は何から始める？",
        "朝だね。ゆっくりでもいいから始めよ。"
      ],

      afternoon: [
        "午後も少しずつ進めよ。",
        "まだ時間あるね。焦らなくて大丈夫。"
      ],

      night: [
        "もう夜だね。無理しすぎないようにしよ。",
        "今日の残り、少しだけ確認しておこ。"
      ],

      daily: [
        "今日も来たね。よろしく。",
        "今日も一日、ゆっくり進めよ。"
      ],

      add: [
        "新しい予定、追加したんだね。",
        "了解。忘れないようにしよ。"
      ],

      success: [
        "お、ちゃんと終わったんだ。いい感じだね。",
        "クリアできたね。その調子でいこ。"
      ],

      streak: [
        "また終わったんだ。今日はかなり進んでるね。",
        "連続でクリアしてる。いい調子だね。"
      ],

      fail: [
        "今日はダメだったか。でも、そんなに気にしなくていいと思う。",
        "今回は残念だったね。次はうまくいくと思うよ。"
      ],

      complete: [
        "全部終わったんだ。お疲れさま。今日はゆっくりしていいんじゃない？",
        "全任務完了だね。ちゃんと頑張ったじゃん。"
      ],

      levelUp: [
        "レベル上がったね。ちゃんと進んでるよ。",
        "LEVEL UPだね。少しずつだけど、確実に強くなってる。"
      ],

      half: [
        "半分くらい終わったね。順調だと思う。",
        "結構進んだね。このままいこ。"
      ],

      almost: [
        "あと少しだね。もうちょっとだけ頑張ろ。",
        "ほとんど終わってる。あと少しだよ。"
      ],

      noQuest: [
        "今日は予定ないんだね。ゆっくりできそう。",
        "クエストはないみたい。休むのもいいと思う。"
      ],

      lowHp: [
        "HPかなり減ってるね。今日は少し休んだ方がいいかも。"
      ],

      talk: [
        "どうしたの？",
        "呼んだ？",
        "少し休憩してたところ。"
      ]

    }
  }

];



// ===================================
// HTML
// ===================================

const questNameInput =
  document.getElementById("questName");

const questXpInput =
  document.getElementById("questXp");

const questDateInput =
  document.getElementById("questDate");

const addQuestButton =
  document.getElementById("addQuestButton");

const todayQuestList =
  document.getElementById("todayQuestList");

const weekPlan =
  document.getElementById("weekPlan");

const prevWeekButton =
  document.getElementById("prevWeekButton");

const currentWeekButton =
  document.getElementById("currentWeekButton");

const nextWeekButton =
  document.getElementById("nextWeekButton");

const scoreText =
  document.getElementById("score");

const levelText =
  document.getElementById("level");

const hpText =
  document.getElementById("hp");

const xpBar =
  document.getElementById("xpBar");

const hpBar =
  document.getElementById("hpBar");

const todayText =
  document.getElementById("todayText");

const weekRangeText =
  document.getElementById("weekRangeText");

const resetLevelButton =
  document.getElementById("resetLevelButton");

const operatorImage =
  document.getElementById("operatorImage");

const operatorName =
  document.getElementById("operatorName");

const operatorMessage =
  document.getElementById("operatorMessage");

const operatorShift =
  document.getElementById("operatorShift");

const nextOperator =
  document.getElementById("nextOperator");



// ===================================
// DATE
// ===================================

function formatDate(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return (
    year +
    "-" +
    month +
    "-" +
    day
  );

}


function getToday() {

  return formatDate(
    new Date()
  );

}


function createDateFromString(
  dateString
) {

  const parts =
    dateString.split("-");

  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

}


function displayDate(
  dateString
) {

  const date =
    createDateFromString(
      dateString
    );

  const weekdays = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
  ];

  return (
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " (" +
    weekdays[date.getDay()] +
    ")"
  );

}



// ===================================
// OLD QUEST SUPPORT
// ===================================

let migrated =
  false;


quests.forEach(
  function (quest) {

    if (!quest.date) {

      quest.date =
        getToday();

      migrated =
        true;

    }

  }
);


if (migrated) {

  saveQuests();

}



// ===================================
// CLEAR STREAK DATE CHECK
// ===================================

if (
  savedStreakDate !==
  getToday()
) {

  clearStreak =
    0;

  localStorage.setItem(
    "clearStreak",
    "0"
  );

  localStorage.setItem(
    "clearStreakDate",
    getToday()
  );

}



// ===================================
// OPERATOR ROTATION
// ===================================

function getOperatorIndex() {

  const start =
    new Date(
      2026,
      8,
      27,
      0,
      0,
      0
    );

  const now =
    new Date();

  const twelveHours =
    12 *
    60 *
    60 *
    1000;

  const blocksPassed =
    Math.floor(
      (
        now.getTime() -
        start.getTime()
      ) /
      twelveHours
    );

  return (
    (
      blocksPassed %
      operators.length
    ) +
    operators.length
  ) %
  operators.length;

}


function getCurrentOperator() {

  return operators[
    getOperatorIndex()
  ];

}


function getShiftText() {

  const hour =
    new Date().getHours();

  if (
    hour < 12
  ) {

    return (
      "12:00 AM — 11:59 AM"
    );

  }

  return (
    "12:00 PM — 11:59 PM"
  );

}



// ===================================
// TIME PERIOD
// ===================================

function getTimePeriod() {

  const hour =
    new Date().getHours();


  if (
    hour >= 5 &&
    hour < 12
  ) {

    return "morning";

  }


  if (
    hour >= 12 &&
    hour < 18
  ) {

    return "afternoon";

  }


  return "night";

}



// ===================================
// RANDOM MESSAGE
// ===================================

function randomMessage(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}



// ===================================
// TODAY PROGRESS
// ===================================

function getTodayProgress() {

  const today =
    getToday();


  const todays =
    quests.filter(
      function (quest) {

        return (
          quest.date ===
          today
        );

      }
    );


  const completed =
    todays.filter(
      function (quest) {

        return quest.completed;

      }
    ).length;


  const failed =
    todays.filter(
      function (quest) {

        return quest.failed;

      }
    ).length;


  const total =
    todays.length;


  const rate =
    total === 0
      ? 0
      : completed / total;


  return {

    total:
      total,

    completed:
      completed,

    failed:
      failed,

    rate:
      rate

  };

}



// ===================================
// OPERATOR DISPLAY
// ===================================

let operatorReturnTimer =
  null;


function showOperator(
  state = "idle"
) {

  const current =
    getCurrentOperator();


  operatorName.textContent =
    current.name;


  operatorShift.textContent =
    getShiftText();


  const nextIndex =
    (
      getOperatorIndex() +
      1
    ) %
    operators.length;


  nextOperator.textContent =
    "NEXT // " +
    operators[nextIndex].name;



  // LEVEL UP
  // HPが低くてもレベルアップ演出は優先

  if (
    state === "levelUp"
  ) {

    operatorImage.src =
      current.images.happy;

    operatorMessage.textContent =
      randomMessage(
        current.messages.levelUp
      );

    return;

  }



  // HP LOW

  if (
    hp <= 30
  ) {

    operatorImage.src =
      current.images.serious;

    operatorMessage.textContent =
      randomMessage(
        current.messages.lowHp
      );

    return;

  }



  // DAILY GREETING

  if (
    state === "daily"
  ) {

    operatorImage.src =
      current.images.casual;

    operatorMessage.textContent =
      randomMessage(
        current.messages.daily
      );

    return;

  }



  // QUEST ADDED

  if (
    state === "add"
  ) {

    operatorImage.src =
      current.images.casual;

    operatorMessage.textContent =
      randomMessage(
        current.messages.add
      );

    return;

  }



  // SUCCESS

  if (
    state === "success"
  ) {

    operatorImage.src =
      current.images.happy;

    operatorMessage.textContent =
      randomMessage(
        current.messages.success
      );

    return;

  }



  // STREAK

  if (
    state === "streak"
  ) {

    operatorImage.src =
      current.images.happy;

    operatorMessage.textContent =
      randomMessage(
        current.messages.streak
      );

    return;

  }



  // FAIL

  if (
    state === "fail"
  ) {

    operatorImage.src =
      current.images.serious;

    operatorMessage.textContent =
      randomMessage(
        current.messages.fail
      );

    return;

  }



  // COMPLETE

  if (
    state === "complete"
  ) {

    operatorImage.src =
      current.images.happy;

    operatorMessage.textContent =
      randomMessage(
        current.messages.complete
      );

    return;

  }



  // CLICK / TALK

  if (
    state === "talk"
  ) {

    operatorImage.src =
      current.images.casual;

    operatorMessage.textContent =
      randomMessage(
        current.messages.talk
      );

    return;

  }



  // ===================================
  // NORMAL IDLE STATE
  // ===================================

  const progress =
    getTodayProgress();


  if (
    progress.total === 0
  ) {

    operatorImage.src =
      current.images.casual;

    operatorMessage.textContent =
      randomMessage(
        current.messages.noQuest
      );

    return;

  }


  if (
    progress.completed ===
    progress.total
  ) {

    operatorImage.src =
      current.images.happy;

    operatorMessage.textContent =
      randomMessage(
        current.messages.complete
      );

    return;

  }


  if (
    progress.rate >= 0.75
  ) {

    operatorImage.src =
      current.images.normal;

    operatorMessage.textContent =
      randomMessage(
        current.messages.almost
      );

    return;

  }


  if (
    progress.rate >= 0.5
  ) {

    operatorImage.src =
      current.images.normal;

    operatorMessage.textContent =
      randomMessage(
        current.messages.half
      );

    return;

  }


  const period =
    getTimePeriod();


  if (
    period === "night"
  ) {

    operatorImage.src =
      current.images.casual;

  }

  else {

    operatorImage.src =
      current.images.normal;

  }


  operatorMessage.textContent =
    randomMessage(
      current.messages[
        period
      ]
    );

}



// ===================================
// TEMPORARY OPERATOR REACTION
// ===================================

function temporaryOperatorState(
  state,
  duration = 8000
) {

  showOperator(
    state
  );


  clearTimeout(
    operatorReturnTimer
  );


  operatorReturnTimer =
    setTimeout(
      function () {

        showOperator(
          "idle"
        );

      },
      duration
    );

}



// ===================================
// LEVEL UP EFFECT
// ===================================

function playLevelUpEffect() {

  const playerPanel =
    document.querySelector(
      ".player"
    );


  playerPanel.classList.remove(
    "level-up-effect"
  );


  xpBar.classList.remove(
    "level-up-effect"
  );


  // アニメーションを再スタートさせる
  void playerPanel.offsetWidth;


  playerPanel.classList.add(
    "level-up-effect"
  );


  xpBar.classList.add(
    "level-up-effect"
  );


  setTimeout(
    function () {

      playerPanel.classList.remove(
        "level-up-effect"
      );


      xpBar.classList.remove(
        "level-up-effect"
      );

    },
    1500
  );

}



// ===================================
// OPERATOR CLICK
// ===================================

operatorImage.addEventListener(
  "click",
  function () {

    temporaryOperatorState(
      "talk",
      6000
    );

  }
);



// ===================================
// PLAYER UPDATE
// ===================================

function updatePlayer() {

  scoreText.textContent =
    score;


  const level =
    Math.floor(
      score / 100
    ) + 1;


  levelText.textContent =
    level;


  hpText.textContent =
    hp;


  xpBar.style.width =
    (
      score %
      100
    ) +
    "%";


  hpBar.style.width =
    hp +
    "%";


  localStorage.setItem(
    "score",
    String(score)
  );


  localStorage.setItem(
    "hp",
    String(hp)
  );

}



// ===================================
// SAVE QUESTS
// ===================================

function saveQuests() {

  localStorage.setItem(
    "quests",
    JSON.stringify(
      quests
    )
  );

}



// ===================================
// ALL COMPLETE CHECK
// ===================================

function areTodayQuestsComplete() {

  const today =
    getToday();


  const todays =
    quests.filter(
      function (quest) {

        return (
          quest.date ===
          today
        );

      }
    );


  if (
    todays.length === 0
  ) {

    return false;

  }


  return todays.every(
    function (quest) {

      return quest.completed;

    }
  );

}



// ===================================
// TODAY QUESTS
// ===================================

function showTodayQuests() {

  todayQuestList.innerHTML =
    "";


  const today =
    getToday();


  const todayQuests =
    quests.filter(
      function (quest) {

        return (
          quest.date ===
          today
        );

      }
    );


  if (
    todayQuests.length === 0
  ) {

    const message =
      document.createElement(
        "p"
      );


    message.className =
      "empty-message";


    message.textContent =
      "今日のクエストはありません。";


    todayQuestList.appendChild(
      message
    );


    return;

  }



  todayQuests.forEach(
    function (quest) {

      const realIndex =
        quests.indexOf(
          quest
        );


      const questBox =
        document.createElement(
          "div"
        );


      questBox.className =
        "quest-card";


      const name =
        document.createElement(
          "div"
        );


      name.className =
        "quest-name";


      const nameText =
        document.createElement(
          "span"
        );


      nameText.textContent =
        quest.name;


      const xpText =
        document.createElement(
          "span"
        );


      xpText.className =
        "quest-xp";


      xpText.textContent =
        "+" +
        quest.xp +
        " XP";


      name.appendChild(
        nameText
      );


      name.appendChild(
        xpText
      );


      const clearButton =
        document.createElement(
          "button"
        );


      clearButton.textContent =
        "達成";


      clearButton.className =
        "clear-button";


      const failButton =
        document.createElement(
          "button"
        );


      failButton.textContent =
        "失敗";


      failButton.className =
        "fail-button";


      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.textContent =
        "削除";


      deleteButton.className =
        "delete-button";



      if (
        quest.completed
      ) {

        clearButton.textContent =
          "クリア済み";

        clearButton.disabled =
          true;

        failButton.disabled =
          true;

      }



      if (
        quest.failed
      ) {

        failButton.textContent =
          "失敗済み";

        failButton.disabled =
          true;

        clearButton.disabled =
          true;

      }



      // =================================
      // CLEAR
      // =================================

      clearButton.addEventListener(
        "click",
        function () {

          if (
            quest.completed ||
            quest.failed
          ) {

            return;

          }


          // 達成前のLEVEL
          const oldLevel =
            Math.floor(
              score / 100
            ) + 1;


          score +=
            quest.xp;


          // 達成後のLEVEL
          const newLevel =
            Math.floor(
              score / 100
            ) + 1;


          const didLevelUp =
            newLevel >
            oldLevel;


          quest.completed =
            true;


          clearStreak++;


          localStorage.setItem(
            "clearStreak",
            String(
              clearStreak
            )
          );


          localStorage.setItem(
            "clearStreakDate",
            getToday()
          );


          updatePlayer();

          saveQuests();

          showTodayQuests();

          showWeekPlan();



          // LEVEL UPが最優先

          if (
            didLevelUp
          ) {

            playLevelUpEffect();


            temporaryOperatorState(
              "levelUp",
              9000
            );

          }


          // 全クエスト達成

          else if (
            areTodayQuestsComplete()
          ) {

            temporaryOperatorState(
              "complete"
            );

          }


          // 2連続以上

          else if (
            clearStreak >= 2
          ) {

            temporaryOperatorState(
              "streak"
            );

          }


          // 普通の達成

          else {

            temporaryOperatorState(
              "success"
            );

          }

        }
      );



      // =================================
      // FAIL
      // =================================

      failButton.addEventListener(
        "click",
        function () {

          if (
            quest.completed ||
            quest.failed
          ) {

            return;

          }


          hp -=
            10;


          if (
            hp < 0
          ) {

            hp =
              0;

          }


          quest.failed =
            true;


          clearStreak =
            0;


          localStorage.setItem(
            "clearStreak",
            "0"
          );


          updatePlayer();

          saveQuests();

          showTodayQuests();

          showWeekPlan();


          temporaryOperatorState(
            "fail"
          );

        }
      );



      // =================================
      // DELETE
      // =================================

      deleteButton.addEventListener(
        "click",
        function () {

          const answer =
            confirm(
              "「" +
              quest.name +
              "」を削除しますか？"
            );


          if (
            !answer
          ) {

            return;

          }


          quests.splice(
            realIndex,
            1
          );


          saveQuests();

          showTodayQuests();

          showWeekPlan();

          showOperator(
            "idle"
          );

        }
      );


      questBox.appendChild(
        name
      );

      questBox.appendChild(
        clearButton
      );

      questBox.appendChild(
        failButton
      );

      questBox.appendChild(
        deleteButton
      );


      todayQuestList.appendChild(
        questBox
      );

    }
  );

}



// ===================================
// MONDAY
// ===================================

function getMonday(
  date
) {

  const newDate =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );


  const day =
    newDate.getDay();


  const difference =
    day === 0
      ? -6
      : 1 - day;


  newDate.setDate(
    newDate.getDate() +
    difference
  );


  return newDate;

}



// ===================================
// DISPLAYED WEEK
// ===================================

function getDisplayedMonday() {

  const monday =
    getMonday(
      new Date()
    );


  monday.setDate(
    monday.getDate() +
    weekOffset * 7
  );


  return monday;

}



// ===================================
// WEEK PLAN
// ===================================

function showWeekPlan() {

  weekPlan.innerHTML =
    "";


  const monday =
    getDisplayedMonday();


  const sunday =
    new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + 6
    );


  weekRangeText.textContent =
    displayDate(
      formatDate(monday)
    ) +
    " 〜 " +
    displayDate(
      formatDate(sunday)
    );


  const weekdayNames = [
    "月",
    "火",
    "水",
    "木",
    "金",
    "土",
    "日"
  ];


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const date =
      new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );


    const dateString =
      formatDate(
        date
      );


    const dayColumn =
      document.createElement(
        "div"
      );


    dayColumn.className =
      "day-column";


    if (
      dateString ===
      getToday()
    ) {

      dayColumn.classList.add(
        "today"
      );

    }


    const header =
      document.createElement(
        "div"
      );


    header.className =
      "day-header";


    const weekday =
      document.createElement(
        "div"
      );


    weekday.className =
      "day-name";


    weekday.textContent =
      weekdayNames[i];


    const dateNumber =
      document.createElement(
        "div"
      );


    dateNumber.className =
      "day-date";


    dateNumber.textContent =
      (
        date.getMonth() +
        1
      ) +
      "/" +
      date.getDate();


    header.appendChild(
      weekday
    );


    header.appendChild(
      dateNumber
    );


    if (
      dateString ===
      getToday()
    ) {

      const todayLabel =
        document.createElement(
          "div"
        );


      todayLabel.className =
        "today-label";


      todayLabel.textContent =
        "TODAY";


      header.appendChild(
        todayLabel
      );

    }


    dayColumn.appendChild(
      header
    );


    const dayQuests =
      quests.filter(
        function (quest) {

          return (
            quest.date ===
            dateString
          );

        }
      );


    if (
      dayQuests.length === 0
    ) {

      const empty =
        document.createElement(
          "p"
        );


      empty.className =
        "empty-message";


      empty.textContent =
        "予定なし";


      dayColumn.appendChild(
        empty
      );

    }



    dayQuests.forEach(
      function (quest) {

        const box =
          document.createElement(
            "div"
          );


        box.className =
          "week-quest";


        const questName =
          document.createElement(
            "div"
          );


        questName.className =
          "week-quest-name";


        questName.textContent =
          quest.name;


        const xp =
          document.createElement(
            "div"
          );


        xp.className =
          "week-quest-xp";


        xp.textContent =
          "+" +
          quest.xp +
          " XP";


        const deleteButton =
          document.createElement(
            "button"
          );


        deleteButton.textContent =
          "× 削除";


        deleteButton.className =
          "week-delete-button";


        deleteButton.addEventListener(
          "click",
          function (event) {

            event.stopPropagation();


            const answer =
              confirm(
                "「" +
                quest.name +
                "」を削除しますか？"
              );


            if (
              !answer
            ) {

              return;

            }


            const questIndex =
              quests.indexOf(
                quest
              );


            if (
              questIndex !== -1
            ) {

              quests.splice(
                questIndex,
                1
              );

            }


            saveQuests();

            showTodayQuests();

            showWeekPlan();

            showOperator(
              "idle"
            );

          }
        );


        box.appendChild(
          questName
        );


        box.appendChild(
          xp
        );


        if (
          quest.completed
        ) {

          box.classList.add(
            "completed"
          );


          const status =
            document.createElement(
              "div"
            );


          status.className =
            "status-text";


          status.textContent =
            "✓ CLEAR";


          box.appendChild(
            status
          );

        }


        if (
          quest.failed
        ) {

          box.classList.add(
            "failed"
          );


          const status =
            document.createElement(
              "div"
            );


          status.className =
            "status-text";


          status.textContent =
            "FAILED";


          box.appendChild(
            status
          );

        }


        box.appendChild(
          deleteButton
        );


        dayColumn.appendChild(
          box
        );

      }
    );


    dayColumn.addEventListener(
      "click",
      function () {

        questDateInput.value =
          dateString;

      }
    );


    weekPlan.appendChild(
      dayColumn
    );

  }

}



// ===================================
// ADD QUEST
// ===================================

addQuestButton.addEventListener(
  "click",
  function () {

    const questName =
      questNameInput.value.trim();


    const questXp =
      Number(
        questXpInput.value
      );


    const questDate =
      questDateInput.value;


    if (
      questName === "" ||
      !Number.isFinite(
        questXp
      ) ||
      questXp <= 0 ||
      questDate === ""
    ) {

      alert(
        "クエスト名・XP・日付を入力してください"
      );


      return;

    }


    quests.push({

      name:
        questName,

      xp:
        questXp,

      date:
        questDate,

      completed:
        false,

      failed:
        false

    });


    saveQuests();

    showTodayQuests();

    showWeekPlan();


    questNameInput.value =
      "";


    questXpInput.value =
      "";


    temporaryOperatorState(
      "add",
      6000
    );

  }
);



// ===================================
// LEVEL RESET
// ===================================

resetLevelButton.addEventListener(
  "click",
  function () {

    const answer =
      confirm(
        "LEVELとXPをリセットしますか？\n\nXPは0になり、LEVEL 1に戻ります。\nHPやクエストは消えません。"
      );


    if (
      !answer
    ) {

      return;

    }


    score =
      0;


    updatePlayer();


    alert(
      "LEVEL 1 にリセットしました！"
    );

  }
);



// ===================================
// WEEK BUTTONS
// ===================================

prevWeekButton.addEventListener(
  "click",
  function () {

    weekOffset--;

    showWeekPlan();

  }
);


currentWeekButton.addEventListener(
  "click",
  function () {

    weekOffset =
      0;

    showWeekPlan();

  }
);


nextWeekButton.addEventListener(
  "click",
  function () {

    weekOffset++;

    showWeekPlan();

  }
);



// ===================================
// START
// ===================================

todayText.textContent =
  displayDate(
    getToday()
  );


questDateInput.value =
  getToday();


updatePlayer();

showTodayQuests();

showWeekPlan();



// ===================================
// DAILY GREETING
// ===================================

const lastGreetingDate =
  localStorage.getItem(
    "lastGreetingDate"
  );


if (
  lastGreetingDate !==
  getToday()
) {

  showOperator(
    "daily"
  );


  localStorage.setItem(
    "lastGreetingDate",
    getToday()
  );

}

else {

  showOperator(
    "idle"
  );

}



// ===================================
// OPERATOR / DATE CHECK
// ===================================

let lastOperatorIndex =
  getOperatorIndex();


let lastKnownDate =
  getToday();


setInterval(
  function () {

    const newOperatorIndex =
      getOperatorIndex();


    const newDate =
      getToday();



    // OPERATOR CHANGED

    if (
      newOperatorIndex !==
      lastOperatorIndex
    ) {

      lastOperatorIndex =
        newOperatorIndex;


      showOperator(
        "idle"
      );

    }



    // DATE CHANGED

    if (
      newDate !==
      lastKnownDate
    ) {

      lastKnownDate =
        newDate;


      clearStreak =
        0;


      localStorage.setItem(
        "clearStreak",
        "0"
      );


      localStorage.setItem(
        "clearStreakDate",
        newDate
      );


      todayText.textContent =
        displayDate(
          newDate
        );


      questDateInput.value =
        newDate;


      showTodayQuests();

      showWeekPlan();


      showOperator(
        "daily"
      );


      localStorage.setItem(
        "lastGreetingDate",
        newDate
      );

    }

  },
  60000
);
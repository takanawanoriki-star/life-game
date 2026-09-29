// ===================================
// LIFE GAME - MAIN DATA
// ===================================

let score = Number(localStorage.getItem("score")) || 0;

const savedHp = localStorage.getItem("hp");
let hp = savedHp === null ? 100 : Number(savedHp);
if (!Number.isFinite(hp)) hp = 100;

let quests = JSON.parse(localStorage.getItem("quests")) || [];
let weekOffset = 0;

// One-time fix for the old HP initialization bug.
const hpFixKey = "hpInitializationFixV1";
if (localStorage.getItem(hpFixKey) === null) {
  if (savedHp === "0" && score === 0 && quests.length === 0) {
    hp = 100;
    localStorage.setItem("hp", "100");
  }
  localStorage.setItem(hpFixKey, "done");
}

// Same-day quest clear streak (separate from daily streak).
let questClearStreak = Number(localStorage.getItem("questClearStreakV2")) || 0;
const oldQuestStreakDate = localStorage.getItem("clearStreakDate");
if (oldQuestStreakDate !== getToday()) questClearStreak = 0;

let bestDailyStreak = Number(localStorage.getItem("bestDailyStreak")) || 0;
let customRewards = JSON.parse(localStorage.getItem("customRewards")) || {};
let selectedTheme = localStorage.getItem("selectedTheme") || "cyan";

// ===================================
// REWARD SYSTEM
// ===================================

const rewards = [
  { level: 5,  name: "ROOKIE TITLE", description: "称号 ROOKIE を解放", type: "title" },
  { level: 10, name: "OPERATOR 07 + AGENT", description: "OPERATOR 07・称号 AGENT・VIOLET UI を解放", type: "operator", operatorId: 7 },
  { level: 15, name: "STAR BADGE", description: "15 LEVEL 到達バッジを解放", type: "badge" },
  { level: 20, name: "OPERATOR 08 + ELITE", description: "OPERATOR 08・称号 ELITE・CRIMSON UI を解放", type: "operator", operatorId: 8 },
  { level: 30, name: "ACE + GOLD THEME", description: "称号 ACE と GOLD UI を解放", type: "theme", theme: "gold" },
  { level: 35, name: "OPERATOR 09", description: "OPERATOR 09 を解放", type: "operator", operatorId: 9 },
  { level: 40, name: "MASTER + EMERALD THEME", description: "称号 MASTER と EMERALD UI を解放", type: "theme", theme: "emerald" },
  { level: 50, name: "OPERATOR 10 + LEGEND", description: "OPERATOR 10 と称号 LEGEND を解放", type: "operator", operatorId: 10 },
  { level: 75, name: "OPERATOR 11 + COMMANDER", description: "OPERATOR 11・称号 COMMANDER・ICE UI を解放", type: "operator", operatorId: 11 },
  { level: 100, name: "S-RANK MASTER PACKAGE", description: "称号 S-RANK・初期6人のALT衣装・MASTER VOICE SET・特別祝福イベントを解放", type: "master" }
];

const themes = [
  { id: "cyan", label: "CYAN", level: 1 },
  { id: "violet", label: "VIOLET", level: 10 },
  { id: "crimson", label: "CRIMSON", level: 20 },
  { id: "gold", label: "GOLD", level: 30 },
  { id: "emerald", label: "EMERALD", level: 40 },
  { id: "ice", label: "ICE", level: 75 }
];

function getLevelFromScore(value) {
  return Math.floor(value / 100) + 1;
}

function getTitle(level) {
  if (level >= 100) return "S-RANK";
  if (level >= 75) return "COMMANDER";
  if (level >= 50) return "LEGEND";
  if (level >= 40) return "MASTER";
  if (level >= 30) return "ACE";
  if (level >= 20) return "ELITE";
  if (level >= 10) return "AGENT";
  if (level >= 5) return "ROOKIE";
  return "STARTER";
}

function getNextReward(level) {
  return rewards.find(reward => reward.level > level) || null;
}

function getRewardsUnlockedBetween(oldLevel, newLevel) {
  return rewards.filter(reward => reward.level > oldLevel && reward.level <= newLevel);
}

// ===================================
// OPERATORS
// ===================================

const operators = [
  {
    name: "OPERATOR 01",
    unlockLevel: 1,
    images: imgSet(1),
    messages: {
      morning: ["おはよう。今日の予定、まず確認しておこうか。", "朝から来たんだ。いいスタートじゃない？", "朝のうちに一つ終わらせると、その後が楽だよ。", "今日も起動確認。焦らず始めよ。"],
      afternoon: ["午後の任務も、焦らず一つずつ片付けよ。", "まだ時間はあるよ。順番に進めれば大丈夫。", "午後は集中が落ちやすいから、一件ずつね。", "ここから後半戦。無理なく進めよ。"],
      night: ["もう夜だね。残ってる任務だけ確認しておこっか。", "遅くまでお疲れさま。無理はしすぎないようにね。", "夜は判断力も落ちるから、優先度高いものだけでいいよ。", "今日の終わり方、きれいに決めよ。"],
      daily: ["今日も来たね。じゃあ一日、始めようか。", "本日のシステム起動。今日もよろしく。", "ログイン確認。今日も少しずつ積み上げよ。", "今日の任務、私も見てるからね。"],
      add: ["新しい任務ね。ちゃんと予定に入れておいたよ。", "了解。任務追加っと。忘れないようにね。", "追加確認。やることが見えたら、あとは進めるだけ。", "新規クエスト登録。後で自分に言い訳しないようにね。"],
      success: ["お見事。ちゃんと終わらせたね。", "いい感じ。その調子で進めよ。", "一件クリア。積み重なってきたね。", "ちゃんと実行したの、いいと思う。"],
      questStreak: ["連続クリアじゃん。今日はかなり調子いいね。", "また達成？ふふ、今日はやる気あるじゃん。", "流れ来てるね。このままもう一件いけそう。", "連続で片付いてる。いい集中だよ。"],
      fail: ["今回はうまくいかなかったね。でも次で取り返せばいいよ。", "失敗は確認。次の作戦に切り替えよっか。", "今日は崩れたか。原因だけ覚えて、次に持ち越さないこと。", "一回の失敗で全部が無駄になるわけじゃないよ。"],
      complete: ["本日の任務、全件完了。……なかなかやるじゃん。", "全部終わったね。今日は胸を張っていいよ。", "本日オールクリア。きれいに終わらせたね。", "任務完了。今日はもう十分やったよ。"],
      levelUp: ["LEVEL UP。ちゃんと積み重ねてるね。", "レベルが上がったよ。努力した分、ちゃんと数字に出てるね。", "また一段上がったね。これは偶然じゃないよ。", "レベル更新。次の報酬も見えてきたね。"],
      half: ["半分くらい終わったね。いいペース。", "ここまで順調。後半もこの調子でいこ。", "折り返し。ここからの一件が大事だよ。", "半分クリア。思ったより進んでるんじゃない？"],
      almost: ["あと少しだよ。ここまで来たなら終わらせちゃおっか。", "ほぼ完了。最後までいけそうだね。", "残りわずか。ここで止めるのはもったいないよ。", "ゴール見えてる。あと少しだけ。"],
      noQuest: ["今日はまだ任務なし。予定を入れるなら今のうちだよ。", "今のところ予定なし。少しのんびりできそうだね。", "クエストなし。休むならちゃんと休むのもあり。", "予定が空いてるね。必要なら一つだけ入れてみる？"],
      lowHp: ["HPがかなり減ってる。今日は無理しすぎないこと。", "HP低下を確認。頑張るより回復優先で。", "そのHPなら攻める日じゃないね。休息も任務のうち。"],
      talk: ["どうしたの？ちゃんと見てるよ。", "呼んだ？……まあ、少しくらいなら付き合うよ。", "任務じゃない話でもする？", "進捗は見えてるよ。気を抜きすぎないでね。", "こうして毎日開いてる時点で、前には進んでるよ。"],
      dailyStreak: ["{n}日連続。ちゃんと続いてるね。", "連続記録、{n}日。積み重ねは裏切らないね。", "{n}日目クリア。いい習慣になってきたじゃん。", "今日もつないだね。STREAK {n} DAYS。"],
      bestStreak: ["自己ベスト更新。{n}日。これはちゃんと記録しておこう。", "BEST STREAK更新だね。{n}日、いい数字。", "新記録。ここからどこまで伸ばせるか楽しみだね。"],
      rewardUnlock: ["LEVEL {level}到達。{reward}、解放。", "報酬アンロック。{reward}。ちゃんと取りに来たね。", "新しい報酬が使えるよ。次の目標も見えてきたね。"],
      lateNightStreak: ["こんな時間までやって{n}日継続か。今日はもう十分じゃない？", "夜遅くまでお疲れさま。{n}日連続は立派だけど、睡眠も忘れないで。"],
      comeback: ["久しぶり。戻ってきたなら、それで十分。今日からまた始めよ。", "しばらく空いたね。でも再開できたのはいいことだよ。"]
    }
  },
  {
    name: "OPERATOR 02",
    unlockLevel: 1,
    images: imgSet(2),
    messages: {
      morning: ["おはよ。ちゃんと起きてるじゃん。", "朝から予定確認してるの？えらいじゃん。", "朝一で来たんだ。今日はやる気あるね。", "寝ぼけてない？最初のクエスト決めよ。"],
      afternoon: ["午後もまだあるね。ちゃんと続けよ。", "ここからサボらないでよ？", "午後って一番だれやすいからね。逃げないでよ。", "まだ終わってないなら、今から一個やろ。"],
      night: ["もう夜じゃん。残ってるのだけ確認しよ。", "今日も結構頑張ったんじゃない？", "夜まで残ってるの？まあ、無理はしないで。", "今日の分、ちゃんと締めてから寝よ。"],
      daily: ["今日も来たんだ。じゃ、今日もよろしく。", "お、起動した。今日もちゃんとやるんでしょ？", "今日もログインしたんだ。三日坊主じゃなくて安心した。", "はい今日の任務開始。サボったらわかるからね。"],
      add: ["また予定増やしたんだ。ちゃんとやってよね。", "追加ね。忘れないようにしなよ？", "自分で入れたクエストなんだから、逃げないでよ。", "登録完了。あとで見なかったことにするの禁止。"],
      success: ["やったね。ちゃんとできると思ってたよ。", "お、クリア！結構いい感じじゃん。", "できたじゃん。ほら、やればいけるって。", "一個終わったね。普通にえらいじゃん。"],
      questStreak: ["またクリア！？今日はちゃんとしてるじゃん。", "連続じゃん。ちょっと見直したかも。", "え、また終わったの？今日強いじゃん。", "その勢いなら、もう一個いけるんじゃない？"],
      fail: ["んー、今日はダメだったか。でも次はちゃんとやろ？", "まあ一回くらい大丈夫。次で取り返そ。", "失敗ね。落ち込むより、次どうするか決めよ。", "今日はうまくいかなかったか。じゃあ次、ちゃんとね。"],
      complete: ["全部終わったの？すご。今日はもうゆっくりしていいんじゃない？", "全任務クリア！……ちゃんとやるじゃん。", "え、全部終わり？思ったよりやるじゃん。", "本日パーフェクト。今日は文句なし。"],
      levelUp: ["レベル上がったじゃん。結構やるね。", "LEVEL UP！ちゃんと強くなってるじゃん。", "またレベル上がった。意外と続いてるね。", "LEVEL更新。次の報酬、狙いにいこ。"],
      half: ["半分終わったね。あと半分。", "結構進んでるじゃん。いい感じ。", "折り返しだね。ここからサボらないでよ？", "半分クリア。今日はちゃんとしてる。"],
      almost: ["あとちょっとじゃん。ここでやめないでよ？", "もうほぼ終わり。最後までやっちゃお。", "あと少し。ここで逃げたらもったいないって。", "ゴール見えてるじゃん。早く終わらせよ。"],
      noQuest: ["今日予定ないの？珍しいじゃん。", "クエストゼロ。今日は休み？", "何もないなら休んでもいいけど、ダラダラしすぎないでね。", "今日は空っぽだね。そういう日もあり。"],
      lowHp: ["HP低いよ。ちょっと休んだ方がいいんじゃない？", "そのHPで無理するのは禁止。", "HPやばいじゃん。今日は回復優先ね。"],
      talk: ["なに？呼んだ？", "どうしたの？暇なの？", "ちゃんと任務もやってよね。", "また押した。そんなに話したかった？", "まあ少しくらいなら相手してあげる。"],
      dailyStreak: ["{n}日連続じゃん。結構やるね。", "STREAK {n} DAYS。ちゃんと続いてるじゃん。", "{n}日目クリア。意外と根性あるんだ。", "また記録つないだね。今日は褒めてあげる。"],
      bestStreak: ["新記録じゃん。{n}日。ちょっとすごいかも。", "BEST STREAK更新！これは普通にえらい。", "自己ベストだよ。ここまで来たらもっと伸ばしたくない？"],
      rewardUnlock: ["LEVEL {level}！{reward}解放されたじゃん。", "新しい報酬きた。{reward}。よかったね。", "報酬アンロック。ちゃんと頑張った分だね。"],
      lateNightStreak: ["こんな時間までやって{n}日連続？頑張りすぎじゃない？", "記録はすごいけど、そろそろ寝た方がいいよ。"],
      comeback: ["久しぶりじゃん。まあ戻ってきたならいいけど。", "しばらく見なかったね。今日からまた続ければいいでしょ。"]
    }
  },
  {
    name: "OPERATOR 03",
    unlockLevel: 1,
    images: imgSet(3),
    messages: {
      morning: ["おはよう。まず今日の予定を確認しよう。", "朝のうちに優先順位を決めておくと楽だよ。", "最初の一件を早めに終わらせると流れが作れるよ。", "朝の判断が一日の進み方を決める。無理のない順番でいこう。"],
      afternoon: ["午後も焦らず進めよう。まだ十分時間あるよ。", "ここから集中が切れやすいから、一つずつね。", "午後は優先度を見直して、必要なものから片付けよう。", "今のペースを崩さなくて大丈夫。"],
      night: ["夜になったね。残りを確認して、無理なら調整しよ。", "今日やるべきことだけ終わらせれば十分だよ。", "遅い時間なら、明日に回す判断も大事だよ。", "今日の進捗を整理して終わろう。"],
      daily: ["今日も始めよっか。まず予定を確認しよう。", "おはよう。今日も一日、うまく進めていこう。", "今日の目標を絞って、確実に進めよう。", "準備できた？無理のない計画でいこう。"],
      add: ["予定追加ね。無理のない量かだけ確認しておいて。", "了解。新しい任務、予定に入ったよ。", "追加した分、優先順位も一度確認しておこう。", "新しいクエストね。予定を詰めすぎないように。"],
      success: ["いいじゃん。その調子。ちゃんと積み上がってるよ。", "ナイス。今のペースなら十分。", "一件完了。計画通り進められてるね。", "よくできた。次も同じように進めれば大丈夫。"],
      questStreak: ["連続で終わらせてるね。かなりいい流れ。", "調子いいじゃん。このまま集中を切らさずいこ。", "連続クリア。今の集中を大事にしよう。", "いいペースだね。無理に飛ばしすぎないように。"],
      fail: ["まあ、こういう日もある。でも次に引きずるのはなしね。", "失敗は失敗。それで終わり。次に切り替えよ。", "原因を一つだけ確認して、あとは前を向こう。", "予定通りにいかない日もある。修正すれば大丈夫。"],
      complete: ["全部完了。よく頑張ったね。今日は合格。", "全任務クリア。ちゃんと最後までやったじゃん。", "本日のタスク完了。今日はきれいに締められたね。", "全件完了。休む時間もちゃんと取ってね。"],
      levelUp: ["LEVEL UP。努力が数字に出てきたね。", "レベルアップだね。この積み重ねを続けていこう。", "一段上がったね。継続してきた結果だよ。", "レベル更新。次の節目まで、また一つずつ。"],
      half: ["半分まで来たね。このペースなら大丈夫。", "いい進み方してるよ。あと半分。", "折り返し地点。ここからも同じペースで。", "半分終わったなら、今日の流れは悪くないよ。"],
      almost: ["あと少し。ここまで来たら最後までいこ。", "ほぼ完了だね。ラスト一踏ん張り。", "残りは少ないよ。焦らず確実に。", "もう終盤。最後の一件まで丁寧に。"],
      noQuest: ["今日は予定なしだね。休む日にするのも大事だよ。", "クエストはないみたい。必要なら今のうちに予定を立てよ。", "空白日も計画の一部。休むならしっかり休もう。", "予定がない日は、次の準備に使うのもいいね。"],
      lowHp: ["ちょっと頑張りすぎ。今日は負荷を下げてもいいんじゃない？", "HPが低いね。回復を優先しよう。", "今日は出力を落としていい。継続する方が大事だから。"],
      talk: ["どうした？何か相談？", "ちゃんと進んでる？困ったら一回整理しよ。", "休憩も予定のうちだからね。", "今詰まってるなら、次の一件だけ決めようか。", "進みが遅くても、止まらなければ大丈夫。"],
      dailyStreak: ["{n}日継続できたね。こういう積み重ねが一番大事だよ。", "連続{n}日。もう習慣として形になってきてる。", "{n}日目も完了。安定して続けられてるね。", "STREAK {n} DAYS。継続力が数字に出てきた。"],
      bestStreak: ["自己ベスト更新、{n}日。努力の積み重ねが記録になったね。", "BEST STREAK更新。今のやり方が機能してる証拠だよ。", "新記録だね。このペースを大事にしよう。"],
      rewardUnlock: ["LEVEL {level}到達。{reward}が解放されたよ。", "報酬獲得。ここまでの積み重ねの結果だね。", "新しいアンロックだね。次の節目も焦らずいこう。"],
      lateNightStreak: ["{n}日連続は立派。でもこの時間なら、今日はここで終わりにしてもいいよ。", "継続は大事だけど、睡眠を削る必要はないからね。"],
      comeback: ["久しぶりだね。再開できたなら十分。今日からまた積み上げよう。", "少し間が空いたね。まず一件から戻していこう。"]
    }
  },
  {
    name: "OPERATOR 04",
    unlockLevel: 1,
    images: imgSet(4),
    messages: {
      morning: ["おはよー！今日も任務始めますか！", "朝だぞー！XP稼ぎに行こーぜ！", "朝一ログイン！今日は何レベル上げる？", "起床確認！一発目のクエストいってみよー！"],
      afternoon: ["午後戦スタート！まだまだいけるでしょ！", "さあ後半戦！ここからですよー！", "午後の部いきまーす！眠気に負けるなー！", "ここから巻き返しタイム！"],
      night: ["夜になりましたー！残り何個だー？", "今日も終盤戦！あとちょっと頑張る？", "ナイトミッション開始！でも無理はすんなよー！", "本日ラストスパート！終わったら解散！"],
      daily: ["はい本日のLife Gameスタートー！", "今日も来たね！さーて何からやる？", "ログインボーナスはないけど、やる気ボーナスはある！たぶん！", "今日もミッション祭り、開幕ー！"],
      add: ["任務追加！逃げ道なくなりましたー！笑", "お、新しいクエスト！ちゃんとクリアしてね！", "NEW QUEST！自分で入れたからにはやるしかない！", "任務登録完了！未来の自分、よろしくー！"],
      success: ["よっしゃー！ナイス！今日は調子いいじゃん！", "おお！やるじゃん！そのまま行こ！", "CLEAR！XPいただきー！", "一個撃破！次のターゲットどれだー！"],
      questStreak: ["連続クリアきたー！今日つよ！", "また！？めっちゃ調子いいじゃん笑", "コンボ継続！止まるな止まるなー！", "連続撃破！今日のMVP狙えるぞ！"],
      fail: ["あちゃー、やっちゃったね。でもまあ次いこ次！", "ドンマイドンマイ！一個失敗したくらいで終わらんよ！", "MISSION FAILED！でもゲームオーバーじゃない！", "HP減ったー！今日は回復しながらいこ！"],
      complete: ["全クリきたー！今日はもう勝ちでしょ！", "全部終わった！？強すぎ笑 お疲れ！", "PERFECT CLEAR！本日の優勝者はこちら！", "全任務撃破ー！はい拍手ー！"],
      levelUp: ["レベルアップきたー！いいじゃん！", "LEVEL UP！また一段強くなったね！", "レベル上昇！演出入ります！ドーン！", "また強くなったー！次の報酬まで突っ走れ！"],
      half: ["半分クリア！折り返し地点でーす！", "お、結構進んでんじゃん！", "50%突破！ここから後半戦！", "半分終わり！いいぞいいぞー！"],
      almost: ["あとちょっと！ここで逃げるのは禁止ね笑", "ほぼ終わりじゃん！全部やっちゃえ！", "ゴール目前！ラストスパート！", "あと少しー！全クリ画面見せてくれー！"],
      noQuest: ["え、今日クエストないの！？休日！？", "予定ゼロ！これは自由時間きたか？", "任務なし！平和！でも暇なら一個入れる？", "本日ノーミッション！レア日じゃん！"],
      lowHp: ["おーい、ボロボロじゃん笑 今日はちょい休み入れよ。", "HP赤いぞー！回復アイテム＝休憩ね！", "無理して全滅するなよー！今日はセーブ運転！"],
      talk: ["なになに？呼んだ？笑", "暇ならクエストやろーぜ！", "クリックしてもXPは増えませーん笑", "はい雑談タイム！でも長居は禁止！", "今日の調子どう？私はいつでも応援担当！"],
      dailyStreak: ["{n}連勝きたー！STREAK {n} DAYS！", "{n}日連続！これもうイベント発生でしょ！", "またつないだー！連続記録{n}日！", "今日も勝利！{n}日連続、強すぎ！"],
      bestStreak: ["新記録きたーー！BEST {n} DAYS！", "自己ベスト更新！これは祝うしかない！", "記録更新！スクショ案件じゃんこれ！"],
      rewardUnlock: ["LEVEL {level}到達ー！{reward}アンロック！", "報酬解禁きたー！{reward}！", "NEW REWARD！頑張った分ちゃんと返ってきたぞー！"],
      lateNightStreak: ["夜中に{n}連勝は熱い！……でも寝ろー！笑", "記録は最高！睡眠もミッションだからなー！"],
      comeback: ["おかえりー！久々のログインじゃん！", "復帰勢きたー！今日からまた連勝作ろうぜ！"]
    }
  },
  {
    name: "OPERATOR 05",
    unlockLevel: 1,
    images: imgSet(5),
    messages: {
      morning: ["おはよ。ちゃんと起きたんだ笑", "朝から来てるじゃん。今日はやる気ある？", "朝ログインとか偉すぎ。どうしたの笑", "眠そうだけど大丈夫？最初の一個だけやろ。"],
      afternoon: ["午後だけどまだいけるよね？", "ここからサボったらダメだからね。", "午後の眠い時間きたね。寝ないでよ？笑", "まだ今日終わってないからねー。"],
      night: ["もう夜じゃん。まだクエスト残ってる？", "夜までお疲れ。でも無理はしないでよね。", "こんな時間までやってんの？ちょっと偉い。", "夜だよー。終わらせるか明日にするか決めよ。"],
      daily: ["今日も来たじゃん。ちゃんとやるんでしょ？", "Life Game起動！今日も頑張ってください笑", "また来てる。なんだかんだ続いてるね。", "はい今日もスタート。私が見張っときます笑"],
      add: ["またクエスト増やしたの？自分で入れたんだからやってね笑", "はい追加ー。あとで忘れたとかなしね。", "予定増やしたー。未来の自分が怒るやつ笑", "クエスト追加っと。ちゃんと回収してね。"],
      success: ["え、やるじゃん！ちょっと見直したかも笑", "ナイス！はい、ちゃんと褒めてあげます。", "クリアじゃん。今日は偉いねー。", "お、終わった！ちゃんとできるじゃん笑"],
      questStreak: ["え、またクリア？今日どうしたの笑", "連続じゃん！普通にすごくない？", "コンボ続いてる笑 今日強いね。", "また！？ちょっと本気出しすぎじゃない？"],
      fail: ["あーあ笑 でも次ちゃんとやればよくない？", "失敗じゃん！……まあ次頑張ればセーフ！", "HP減ったー。今日は無理しないでね。", "やっちゃったね笑 でも引きずるのは禁止。"],
      complete: ["全クリ！？今日はガチで偉いじゃん！", "え、全部終わったの？ちょっと強すぎない？", "今日のクエスト全部消えてる！やるじゃん！", "本日完全勝利ー。普通にすごい。"],
      levelUp: ["え、レベル上がった！普通にすごくない？笑", "LEVEL UPじゃん！今日はちゃんと褒めてあげる笑", "また上がった！地味に強くなってるじゃん。", "レベル更新！報酬チェックしよー。"],
      half: ["半分終わったじゃん。意外と早いね。", "結構進んでる。ちゃんとやってるじゃん。", "もう半分？今日いい感じだね。", "折り返しー。ここからサボらないでよ笑"],
      almost: ["あとちょっと！ここまで来てやめないよね？", "もうすぐ全クリじゃん！早く終わらせよ。", "残り少ないじゃん。今終わらせた方が絶対楽。", "ここまで来たら全部消したくない？笑"],
      noQuest: ["今日クエストないじゃん。暇人？笑", "予定ゼロだ。今日はゆっくりするの？", "何もない日なんだ。まあ休むのも大事か。", "クエストなし！今日は平和だねー。"],
      lowHp: ["HPやばくない？今日はちゃんと休んでよね。", "そのHPで無茶したら怒るよ？笑", "ちょっと休みなよ。倒れたら意味ないじゃん。"],
      talk: ["なにー？", "また押した笑", "私と話してないでクエストやったら？笑", "暇なの？まあちょっとなら話すけど。", "今日ちゃんと頑張ってる？ごまかしてもバレるよ笑"],
      dailyStreak: ["え、{n}日も続いてるじゃん！普通にすごくない？笑", "STREAK {n} DAYS！思ったより根性あるじゃん。", "またつないだ！{n}日連続だよ。", "{n}日目クリアー。今日はちゃんと褒める。"],
      bestStreak: ["自己ベスト更新！？{n}日って普通にすご。", "BEST STREAK更新！ちょっと見直した笑", "新記録じゃん。これもう自慢していいやつ。"],
      rewardUnlock: ["え、LEVEL {level}！{reward}もらえるじゃん！", "新しい報酬きたー。ちゃんと頑張った甲斐あったね。", "アンロックされた！次の報酬も欲しくない？笑"],
      lateNightStreak: ["こんな時間までやって{n}日連続とか、頑張りすぎ笑 もう寝よ？", "記録は偉い。でも夜更かしは褒めません笑"],
      comeback: ["久しぶりじゃん。どこ行ってたの笑", "お、戻ってきた。じゃあ今日からまたやろ。"]
    }
  },
  {
    name: "OPERATOR 06",
    unlockLevel: 1,
    images: imgSet(6),
    messages: {
      morning: ["おはよう。今日は何から始める？", "朝だね。ゆっくりでもいいから始めよ。", "朝に一つ進められたら気持ちいいよ。", "今日も始めよ。最初は軽いやつでもいいと思う。"],
      afternoon: ["午後も少しずつ進めよ。", "まだ時間あるね。焦らなくて大丈夫。", "午後は一回ペースを整えてからやろ。", "ここからもう一件だけでも進めたいね。"],
      night: ["もう夜だね。無理しすぎないようにしよ。", "今日の残り、少しだけ確認しておこ。", "夜までお疲れさま。終わり方だけ決めよ。", "遅い時間なら、無理に全部やらなくてもいいよ。"],
      daily: ["今日も来たね。よろしく。", "今日も一日、ゆっくり進めよ。", "ログインしたね。今日も少しずつでいいよ。", "今日の分、できるところから始めよ。"],
      add: ["新しい予定、追加したんだね。", "了解。忘れないようにしよ。", "クエスト増えたね。無理のない量なら大丈夫。", "追加確認。後で一緒に進捗見よ。"],
      success: ["お、ちゃんと終わったんだ。いい感じだね。", "クリアできたね。その調子でいこ。", "一つ終わった。ちゃんと前に進んでるよ。", "いいね。こういう一件が積み重なるんだと思う。"],
      questStreak: ["また終わったんだ。今日はかなり進んでるね。", "連続でクリアしてる。いい調子だね。", "流れいいね。このまま無理なく続けよ。", "連続クリア。今日は集中できてるね。"],
      fail: ["今日はダメだったか。でも、そんなに気にしなくていいと思う。", "今回は残念だったね。次はうまくいくと思うよ。", "失敗したね。今日は一回切り替えよ。", "うまくいかない日もあるよ。次に持ち越さなければ大丈夫。"],
      complete: ["全部終わったんだ。お疲れさま。今日はゆっくりしていいんじゃない？", "全任務完了だね。ちゃんと頑張ったじゃん。", "全部クリア。今日はかなり進められたね。", "本日の任務終了。ちゃんとやり切ったね。"],
      levelUp: ["レベル上がったね。ちゃんと進んでるよ。", "LEVEL UPだね。少しずつだけど、確実に強くなってる。", "また一つ上がった。続けてきた分だね。", "レベル更新。次の報酬も近づいたね。"],
      half: ["半分くらい終わったね。順調だと思う。", "結構進んだね。このままいこ。", "折り返しだね。無理しないペースで続けよ。", "半分クリア。今日はいい感じだね。"],
      almost: ["あと少しだね。もうちょっとだけ頑張ろ。", "ほとんど終わってる。あと少しだよ。", "ここまで来たなら、残りも終わらせられそう。", "もうゴール近いね。焦らずいこ。"],
      noQuest: ["今日は予定ないんだね。ゆっくりできそう。", "クエストはないみたい。休むのもいいと思う。", "今日は空いてるね。休息日にしてもいいかも。", "予定なし。こういう日も必要だよ。"],
      lowHp: ["HPかなり減ってるね。今日は少し休んだ方がいいかも。", "無理して続けなくていいよ。回復しよ。", "今日は頑張るより、休んで戻す方がよさそう。"],
      talk: ["どうしたの？", "呼んだ？", "少し休憩してたところ。", "何か話す？", "今日の進み方、悪くないと思うよ。"],
      dailyStreak: ["{n}日連続だね。ちゃんと続けられてるよ。", "STREAK {n} DAYS。静かに記録伸びてるね。", "今日もつながった。{n}日目だね。", "{n}日続いたね。こういう積み重ね、いいと思う。"],
      bestStreak: ["自己ベスト更新だね。{n}日。いい記録だと思う。", "BEST STREAK更新。ちゃんと続けてきた結果だね。", "新記録。少しずつ伸びてるね。"],
      rewardUnlock: ["LEVEL {level}。{reward}が解放されたね。", "新しい報酬だね。ここまで続けてきた分。", "アンロックされたよ。次もゆっくり狙っていこ。"],
      lateNightStreak: ["こんな時間まで続けたんだね。{n}日連続はすごいけど、そろそろ休も。", "記録は残るから、今日はもう寝ても大丈夫だよ。"],
      comeback: ["久しぶり。戻ってきたんだね。", "少し空いたけど、また始めれば大丈夫。今日から続けよ。"]
    }
  },
  {
    name: "OPERATOR 07",
    unlockLevel: 10,
    images: imgSet(7),
    intro: [
      "あ、今日から私も担当なんだって。よろしくね！……えっと、何すればいいんだっけ？",
      "はじめまして！今日から担当に入るよ。たぶん大丈夫！……たぶん！"
    ],
    messages: {
      morning: ["おはよー。朝だよ。……あ、知ってる？", "ちゃんと起きたんだ。私も今起きたとこ。たぶん。", "朝のクエストからいく？私は見てる係ね。"],
      afternoon: ["午後だね。お昼食べたら眠くなるよね。私だけ？", "まだ時間あるよ。ゆっくりでも一個ずつやろ。", "午後も頑張ろー。……まず何するんだっけ？"],
      night: ["もう夜だね。今日の残り、いっしょに確認しよ。", "夜までお疲れさま。眠かったらちゃんと休んでね。", "まだクエストある？私ならたぶん明日にしたくなる。"],
      daily: ["今日も来たー。じゃあ一緒に頑張ろ。", "ログイン確認！今日もよろしくね。", "今日の任務見る？……あ、私が見る側だった。"],
      add: ["クエスト追加したよ！……これで合ってるよね？", "予定増えたね。忘れないようにしよー。私も忘れそうだけど。", "新しい任務だ。よし、見守ります！"],
      success: ["お、終わった！えらい！……これでXP増えるんだよね？", "クリアできたじゃん。すごいすごい。", "やったー！……私何もしてないけど嬉しい。"],
      questStreak: ["またクリア！？今日めっちゃ強くない？", "連続で終わってる。なんかゲームみたいで楽しいね。", "え、また？その勢い私にも分けてほしい。"],
      fail: ["あ、失敗になってる。えっと……見なかったことにする？", "今回はだめだったか。次いこ次。", "HP減っちゃったね。休憩もちゃんとしよ？"],
      complete: ["全部終わったの！？じゃあ今日はもう優勝だね。", "本日の任務ぜんぶ完了ー！お疲れさま！", "え、全部消えた。すご。今日はゆっくりしよ。"],
      levelUp: ["レベル上がった！すごい！……で、レベル上がると何ができるの？", "LEVEL UP！なんか光ってる！すごい！", "また強くなったね。私もレベル上がらないかな。"],
      half: ["半分終わったよ。あと半分……たぶん計算合ってる。", "折り返しだね。ここまで来たら結構いい感じ。", "もう半分？ちゃんと進んでるね。"],
      almost: ["あとちょっとだよ。最後までいこー。", "ほぼ終わってる！ここで止めるのもったいないよ。", "ゴール見えてるね。あと一息！"],
      noQuest: ["今日は予定ないんだ。じゃあ休み？やったね。", "クエストゼロだ。……何しよっか。", "今日は空いてるね。ゆっくりしよー。"],
      lowHp: ["HP低いよ。ちゃんと休んで。私でもそれは分かる。", "ちょっと疲れてない？今日は無理しないでね。", "そのHPは危ないやつ。休憩しよ？"],
      talk: ["なにー？呼んだ？", "どうしたの？……あ、押しただけ？", "ちゃんと進んでる？私はちゃんと見てるよ。たぶん。", "暇なら少し話そー。", "私、今なにしようとしてたんだっけ。"],
      dailyStreak: ["{n}日連続！え、そんなに続いてるの？すごい！", "今日もつながったね。STREAK {n} DAYS！", "{n}日目クリアー。ちゃんと続けてるの偉い。"],
      bestStreak: ["自己ベスト更新だって！{n}日！すごいじゃん。", "新記録ー！こういうの私まで嬉しい。", "BEST STREAK更新！今日はお祝いだね。"],
      rewardUnlock: ["LEVEL {level}！{reward}解放だって！……やったね！", "新しい報酬きたよー。{reward}！", "アンロック！次は何が出るんだろ。"],
      lateNightStreak: ["こんな時間までやって{n}日連続！？すごいけど、もう寝よ？", "夜更かししすぎはだめだよ。……私も人のこと言えないけど。"],
      comeback: ["久しぶりー！戻ってきてくれてよかった。", "しばらく見なかったね。今日からまた一緒にやろ。"]
    }
  },
  {
    name: "OPERATOR 08",
    unlockLevel: 20,
    images: imgSet(8),
    intro: [
      "今日から私も担当に入るね。頑張りすぎる前に、ちゃんと頼ってね。",
      "はじめまして。ここまでよく頑張ったね。これからは私も見てるから。"
    ],
    messages: {
      morning: ["おはよう。ちゃんと起きられたのね。えらいえらい。", "朝から来られたんだ。今日はいい日になりそうね。", "まずは無理のないところから始めよっか。"],
      afternoon: ["午後も焦らなくて大丈夫。順番に片付けようね。", "少し疲れてきた？一回整えてから続けよ。", "ここからもうひと頑張り。ちゃんと見てるよ。"],
      night: ["今日もお疲れさま。残りは無理のない範囲でね。", "夜まで頑張ったのね。そろそろ休む準備もしようか。", "全部やる必要はないよ。大事なものだけ終わらせよう。"],
      daily: ["今日もちゃんと来たのね。えらいえらい。", "おかえり。今日も一緒に進めていこうね。", "今日の予定、確認してから始めよっか。"],
      add: ["予定追加ね。詰め込みすぎてない？", "新しいクエスト、入れておいたよ。", "頑張るのはいいけど、ちゃんと余白も残してね。"],
      success: ["よくできました。ちゃんと最後までやれて偉いね。", "一つ終わったね。よしよし、その調子。", "ちゃんとできたじゃない。頑張ったね。"],
      questStreak: ["連続で終わらせてるね。今日は調子いいじゃない。", "またクリア？ふふ、頑張ってるね。", "いい流れだね。でも飛ばしすぎないでね。"],
      fail: ["大丈夫。今日はうまくいかなかっただけ。次は一緒に立て直そ？", "失敗しても、それで全部が駄目になるわけじゃないよ。", "今日は少し予定が重かったかな。次は調整しようね。"],
      complete: ["全部終わったの？本当にお疲れさま。今日はゆっくりしてね。", "全任務完了。よく頑張りました。", "今日は満点。ちゃんと自分を褒めてあげてね。"],
      levelUp: ["レベル上がったの？ふふ、ちゃんと成長してるね。", "LEVEL UP。ここまで積み重ねてきた証拠だね。", "また一つ上がったね。頑張ってるの、ちゃんと分かってるよ。"],
      half: ["半分まで来たね。十分いいペースだよ。", "折り返し。少し休んでから後半でもいいからね。", "半分終わったね。焦らなくて大丈夫。"],
      almost: ["あと少し。ここまで来たなら、最後までいけそうね。", "もう終わりが見えてるよ。あと一息。", "残り少ないね。終わったらちゃんと休もうね。"],
      noQuest: ["今日は予定ないのね。たまにはゆっくりしよっか。", "休息日かな。ちゃんと休むのも大事だよ。", "何もない日も必要。気にしなくていいの。"],
      lowHp: ["HP低いね。今日はもう頑張らなくていいよ。", "ちょっと無理しすぎかな。休もうね。", "頑張るのも大事だけど、壊れない方がもっと大事だからね。"],
      talk: ["どうしたの？お姉さんに話してみる？", "ちゃんと頑張ってるの知ってるよ。", "少し休憩する？", "困ってるなら、一緒に整理しよっか。", "今日はどんな一日だった？"],
      dailyStreak: ["{n}日続いたね。毎日ちゃんと頑張ってて偉いよ。", "STREAK {n} DAYS。続けられてるの、本当に立派。", "{n}日目クリア。よしよし、いい子。"],
      bestStreak: ["自己ベスト更新だね。{n}日。よく頑張りました。", "新記録。ここまで続けられた自分をちゃんと褒めてね。", "BEST STREAK更新。私も嬉しいよ。"],
      rewardUnlock: ["LEVEL {level}到達。{reward}が解放されたよ。おめでとう。", "新しいご褒美だね。頑張った分、ちゃんと受け取って。", "アンロックおめでとう。次も無理せずいこうね。"],
      lateNightStreak: ["こんな時間まで頑張ってたの？{n}日連続は偉いけど、今日はもう寝よ。", "記録は逃げないから、今夜はちゃんと休んでね。"],
      comeback: ["おかえり。戻ってきてくれてよかった。", "少し空いたね。でもまた始められたなら大丈夫。"]
    }
  },
  {
    name: "OPERATOR 09",
    unlockLevel: 35,
    images: imgSet(9),
    intro: [
      "やっと私の番？昔から見てる感じで、これからも気楽にいこ。",
      "今日から担当に入るね。まあ、今まで通りの感じでよろしく。"
    ],
    messages: {
      morning: ["おはよ。ちゃんと起きたんだ。", "朝から来てるじゃん。今日はいい感じ？", "まず一個やっとけば後が楽だよ。いつもそうでしょ。"],
      afternoon: ["午後だね。だれてない？", "まだ時間あるし、焦らなくていいって。", "一回休んでからでもいいから、残り進めよ。"],
      night: ["もう夜じゃん。今日も結構やったんじゃない？", "残ってるなら軽く整理して終わろ。", "無理に全部やらなくていいって。明日もあるし。"],
      daily: ["今日も来たんだ。ちゃんと続いてるじゃん。", "お、来たね。じゃあ今日もやりますか。", "いつもの感じで、できるところからいこ。"],
      add: ["また予定増やしたんだ。ちゃんと回収してね。", "追加ね。忘れそうなら私が覚えとく。", "クエスト増えたじゃん。まあ、無理しない程度に。"],
      success: ["お、終わったんだ。やっぱりやる時はちゃんとやるね。", "クリアじゃん。知ってた、できると思ってた。", "一個終わり。いいじゃん、その調子。"],
      questStreak: ["また終わったの？今日は調子いいじゃん。", "連続クリア。昔からやる時は一気にやるよね。", "そのまま行けそうなら、もう一個やっとく？"],
      fail: ["まあ、こういう日もあるでしょ。次ちゃんとやればいいって。", "失敗したか。引きずるほどのことじゃないよ。", "今日は駄目だったね。じゃ、次で取り返そ。"],
      complete: ["全部終わったんだ。今日はちゃんと頑張ったね。", "全クリじゃん。お疲れ。今日はもう休んでいいでしょ。", "やること全部終わり。なんか私まで安心した。"],
      levelUp: ["レベル上がったじゃん。なんかちょっと嬉しいかも。", "LEVEL UP。ずっと続けてるの、ちゃんと結果出てるね。", "また上がったね。ここまで来ると結構すごい。"],
      half: ["半分終わったね。いいペースじゃん。", "折り返し。ここまで来たなら大丈夫そう。", "もう半分？今日は進んでるね。"],
      almost: ["あとちょっとじゃん。終わらせちゃお。", "残り少ないね。ここまで来たならいけるでしょ。", "ゴール見えてるよ。最後だけ頑張ろ。"],
      noQuest: ["今日は予定ないんだ。珍しいね。", "休みの日？まあ、たまにはいいんじゃない。", "何もないならゆっくりしなよ。"],
      lowHp: ["HP低いじゃん。無理する癖、昔から変わんないね。", "今日は休んだ方がいいって。", "その状態で頑張っても効率悪いよ。ちょっと休も。"],
      talk: ["なに？どうした？", "また話しに来たの？", "ちゃんと進んでる？まあ見れば分かるけど。", "困ったなら言えばいいじゃん。", "久しぶりにこうやって話すのも悪くないね。"],
      dailyStreak: ["{n}日連続。ちゃんと続いてるじゃん。", "STREAK {n} DAYS。なんだかんだ根性あるよね。", "今日もつながったね。{n}日目。"],
      bestStreak: ["自己ベスト更新。{n}日。昔の自分に見せたいね。", "新記録じゃん。普通にすごいよ。", "BEST STREAK更新。ここまで続くと嬉しいね。"],
      rewardUnlock: ["LEVEL {level}。{reward}解放だって。おめでと。", "新しい報酬きたね。ちゃんと頑張った分だよ。", "アンロック。次も狙うんでしょ？"],
      lateNightStreak: ["こんな時間までやってるの？{n}日続いてるんだから、今日はもう十分でしょ。", "昔から無理する時あるよね。もう寝な。"],
      comeback: ["久しぶり。どうせまた忙しかったんでしょ？", "戻ってきたね。まあ、今日からまたやればいいじゃん。"]
    }
  },
  {
    name: "OPERATOR 10",
    unlockLevel: 50,
    images: imgSet(10),
    intro: [
      "やっと解放してくれたんだ。へえ、ここまで来れると思ってたよ。……たぶん。",
      "今日から私も担当。せっかくLv.50まで来たんだから、簡単にはサボらせないよ？"
    ],
    messages: {
      morning: ["おはよ。ちゃんと起きたんだ。えらいね。……普通だけど。", "朝から頑張るんだ？ふふ、いつまで続くかな。", "最初のクエストくらい、さくっと終わらせられるよね？"],
      afternoon: ["午後もまだ残ってるね。ここでサボる？それともちゃんとやる？", "眠い？まあ、言い訳としては弱いかな。", "ここからが本番じゃない？ちゃんと見てるよ。"],
      night: ["こんな時間まで残ってるんだ。頑張るね。", "夜だよ。無理して倒れたらつまんないから、ほどほどにね。", "残りあるなら決めよ。やるか、明日に回すか。"],
      daily: ["今日も来たんだ。偉い偉い。……来るだけなら誰でもできるけど。", "ログイン確認。じゃあ、今日も期待してるね。", "今日も頑張るんでしょ？言ったからにはやってね。"],
      add: ["また予定増やしたんだ。自分を追い込むの好きだね。", "追加完了。あとで『多すぎた』とか言わないでよ？", "新しいクエストね。ちゃんと終わらせたら褒めてあげる。"],
      success: ["へえ、ちゃんと終わらせたんだ。思ったよりやるじゃん。", "クリアね。まあ、そのくらいはできると思ってた。", "できたじゃん。ちょっとだけ見直した。"],
      questStreak: ["またクリア？今日はどうしたの、優秀じゃん。", "連続ね。調子乗ってミスしないでよ？", "その勢い、いつまで続くか見てるね。"],
      fail: ["あ、失敗したんだ。ふふ、まあそういう時もあるよね。", "失敗確認。ちょっと期待しすぎたかな？……冗談。次いこ。", "HP減ったね。ほんとに倒れたらつまんないから休みなよ。"],
      complete: ["全部終わったんだ。へえ、今日は文句つけるところないね。", "全クリ。これはさすがに褒めてあげる。", "完璧じゃん。……ちょっと悔しいかも。"],
      levelUp: ["レベル上がったじゃん。調子乗らない程度に喜んでいいよ。", "LEVEL UP。ここまで来たなら、まあ認めてあげる。", "また一段上がったね。次もちゃんと見せてよ。"],
      half: ["半分ね。ここで満足したら普通だから。", "折り返し。まだ終わってないよ？", "半分クリア。まあ悪くないんじゃない。"],
      almost: ["あと少し。ここまで来て逃げないよね？", "ほぼ終わり。最後までやったら褒めてあげる。", "ゴール直前。ミスしたら面白いけど、ちゃんと決めてね。"],
      noQuest: ["今日は予定なし？へえ、珍しく平和なんだ。", "クエストゼロ。サボりじゃないならいいけど。", "何もないなら休めば？明日ちゃんとやるならね。"],
      lowHp: ["HPやばいけど大丈夫？……ほんとに倒れたらつまんないから休みなよ。", "そのHPで強がるの、あんまり賢くないよ。", "今日は休んだら？私が許可してあげる。"],
      talk: ["なに？そんなに私と話したかった？", "また押したんだ。暇なの？", "ちゃんと任務もやってるなら、少しくらい話してあげる。", "ふふ、どうしたの？", "そんな顔してもクエストは減らないよ。"],
      dailyStreak: ["{n}日連続。へえ、本当に続けてるんだ。", "STREAK {n} DAYS。意外と根性あるね。", "今日もつないだんだ。まあ、褒めてあげる。"],
      bestStreak: ["自己ベスト更新。{n}日。これはちょっとすごいかも。", "新記録ね。やるじゃん。", "BEST STREAK更新。ここまで来たら、もっと伸ばしてみたら？"],
      rewardUnlock: ["LEVEL {level}。{reward}解放。よかったね。", "新しい報酬だって。頑張った甲斐あったじゃん。", "アンロック。ふふ、嬉しそう。"],
      lateNightStreak: ["こんな時間までやって{n}日連続？頑張りすぎ。……もう寝なよ。", "記録はすごいけど、体壊したら私が困るから休んで。"],
      comeback: ["久しぶり。逃げたかと思った。", "戻ってきたんだ。じゃあ、またちゃんと続けてみせて。"]
    }
  },
  {
    name: "OPERATOR 11",
    unlockLevel: 75,
    images: imgSet(11),
    intro: [
      "Lv.75か。ここまで来たなら大したもんだね。今日から私も担当。よろしく。",
      "やっと解放されたね。まあ、ここまで続けたなら私もちゃんと付き合うよ。"
    ],
    messages: {
      morning: ["おはよ。今日の分、やるならさっさとやろ。", "朝から来たんだ。いいじゃん。", "最初の一個だけ早めに終わらせとこ。"],
      afternoon: ["午後だね。残ってるなら順番に片付けよ。", "だれてきた？まあ、一回休んでからでもいいよ。", "まだ時間ある。焦らなくていい。"],
      night: ["夜か。残りだけ確認して終わろ。", "今日もお疲れ。無理なら明日に回せばいい。", "遅くまでやってるね。ほどほどにしな。"],
      daily: ["今日の分、やるならさっさとやろ。", "来たね。じゃあ始めよ。", "続けるのが一番むずかしいんだよ。まあ、ここまで来れてるなら悪くないけど。"],
      add: ["追加ね。ちゃんとやれる量にしときな。", "新しいクエスト。了解。", "予定増やしたなら、あとで文句言わないこと。"],
      success: ["終わったんだ。いいじゃん。ちゃんとやる時はやるんだね。", "クリア。そういうの嫌いじゃない。", "一件完了。悪くない。"],
      questStreak: ["連続で終わってるね。今日は調子いいじゃん。", "またクリアか。いい流れ。", "そのままいけるなら、もう一件やっとこ。"],
      fail: ["まあ失敗は失敗。引きずるより次。", "落ち込むのはあと。立て直すのが先でしょ。", "今回は駄目だったね。じゃ、切り替えよ。"],
      complete: ["全部終わり。今日はちゃんとやったね。", "全クリ。お疲れ。今日はもう休んでいいよ。", "やること全部終わったんだ。……よく頑張ったね。"],
      levelUp: ["レベルアップおめでと。……結構頑張ってるじゃん。", "ここまで来たなら大したもんだよ。ちょっと見直した。", "LEVEL UP。いいじゃん。そのまま続けな。"],
      half: ["半分終わった。悪くないペース。", "折り返しね。ここからも普通にやればいい。", "もう半分か。順調じゃん。"],
      almost: ["あと少し。ここで止める理由ないでしょ。", "残りわずか。終わらせてから休も。", "ゴール見えてる。あと一息。"],
      noQuest: ["今日は何もないんだ。じゃあ休めば。", "休息日ね。そういう日も必要。", "予定なし。無理に作らなくていいよ。"],
      lowHp: ["HP低い。今日は休みな。", "無理しても意味ないよ。ちゃんと回復しな。", "その状態なら休むのが正解。"],
      talk: ["なに？", "どうした。", "話すのはいいけど、やること終わってる？", "まあ、少しくらいなら付き合う。", "よく頑張ったね。たまにはちゃんと褒めとく。"],
      dailyStreak: ["{n}日連続。ちゃんと続けてるね。", "STREAK {n} DAYS。ここまで来たら立派。", "今日もつながった。悪くないじゃん。"],
      bestStreak: ["自己ベスト更新。{n}日。いい記録じゃん。", "新記録。ここまで続けたの、ちゃんとすごいよ。", "BEST STREAK更新。……おめでと。"],
      rewardUnlock: ["LEVEL {level}。{reward}解放。おめでと。", "新しい報酬。ここまで来た分だね。", "アンロックか。ちゃんと受け取っときな。"],
      lateNightStreak: ["こんな時間までやってたの？……無理しすぎないで。今日はちゃんと休みな。", "{n}日連続はすごい。でも今は寝る方が大事。"],
      comeback: ["久しぶり。まあ、戻ってきたならいい。", "空いたね。今日からまたやればいいでしょ。"]
    }
  }
];

function imgSet(n) {
  return {
    normal: `images/op${n}-normal.png`,
    happy: `images/op${n}-happy.png`,
    serious: `images/op${n}-serious.png`,
    casual: `images/op${n}-casual.png`
  };
}

const milestoneMessages = [
  {
    3: "3日連続。最初の壁、越えたね。",
    7: "7日連続。1週間やり切ったね。これは大きいよ。",
    14: "14日。2週間続いたね。もう勢いだけじゃない。",
    30: "30日連続。ここまで来たの、本当に積み重ねた結果だね。",
    50: "50日。かなり遠くまで来たね。記録としても立派。",
    100: "100 DAYS。これはもう習慣じゃなくて、自分の力だね。"
  },
  {
    3: "3日連続じゃん。三日坊主、回避したね。",
    7: "1週間じゃん。結構やるね、ほんと。",
    14: "14日！？もう2週間じゃん。普通にすご。",
    30: "30日連続って本気じゃん。これは褒めるしかない。",
    50: "50日！？そこまで続くと思ってなかった。すごいじゃん。",
    100: "100日って……さすがにすごすぎ。今日は自慢していいよ。"
  },
  {
    3: "3日継続できたね。まずはいいスタート。",
    7: "7日継続できたね。もう偶然じゃなくて習慣になり始めてる。",
    14: "14日。2週間続けられたのはかなり大きいよ。",
    30: "30日連続。継続する仕組みがちゃんと作れてるね。",
    50: "50日。ここまで積み重ねたこと自体が大きな実績だよ。",
    100: "100日継続。これは胸を張っていい記録だね。"
  },
  {
    3: "3連勝きたー！まずは第一関門突破！",
    7: "7 DAYS！1週間コンプリート！これは祝っていいでしょ！",
    14: "14連勝ー！2週間イベントクリア！",
    30: "30 DAYS STREAK！！一か月走り切ったー！",
    50: "50連勝！？もうボス側の強さじゃん！",
    100: "100 DAYSーー！！これは殿堂入りでしょ！！"
  },
  {
    3: "3日続いたじゃん。三日坊主じゃなかった笑",
    7: "え、もう7日！？普通にすご。ちょっと見直した笑",
    14: "2週間！？ちゃんと続けてるじゃん。えら。",
    30: "30日連続！？もう私がいじれないレベルじゃん笑",
    50: "50日って普通にやば。ここまで来ると思ってた？笑",
    100: "100日！？ちょっと待って、それは本当にすごい。"
  },
  {
    3: "3日連続だね。いいスタートだと思う。",
    7: "7日続いたね。静かに積み重ねてきた結果だね。",
    14: "14日。2週間続けられたね。ちゃんと力になってるよ。",
    30: "30日連続。ここまで続けたの、すごいと思う。",
    50: "50日。ずっと積み重ねてきたんだね。",
    100: "100日連続。ここまで来たこと、ちゃんと覚えておいていいと思う。"
  },
  {
    3: "3日連続だよ！ちゃんと続いてる！",
    7: "7日連続！一週間だー！すごい！",
    14: "14日！？二週間も続いたの？えらすぎる！",
    30: "30日連続！一か月ってことだよね？……合ってるよね？",
    50: "50日！半分100だ！……言い方変かな。とにかくすごい！",
    100: "100日ー！これはもう本当にすごい！お祝いしよ！"
  },
  {
    3: "3日続いたね。いいスタート。ちゃんと偉いよ。",
    7: "7日連続。1週間よく頑張りました。",
    14: "14日。2週間も続けられたんだね。立派だよ。",
    30: "30日連続。ここまで続けたの、本当に偉いね。",
    50: "50日。長く積み重ねてきたね。よく頑張りました。",
    100: "100日。ここまで来たあなたを、今日はたくさん褒めてあげたいな。"
  },
  {
    3: "3日連続。まずは三日坊主回避だね。",
    7: "7日続いたじゃん。1週間、ちゃんとやったね。",
    14: "14日か。昔なら途中で飽きてそうなのに、成長したね。",
    30: "30日連続。なんかちょっと感慨深いかも。",
    50: "50日。ここまで続いてるの見ると、普通に嬉しい。",
    100: "100日か。ずっと見てきたみたいで、なんか嬉しいね。おめでと。"
  },
  {
    3: "3日連続。へえ、三日坊主じゃなかったんだ。",
    7: "7日。1週間ね。まあ、これは褒めてあげる。",
    14: "14日連続。思ったよりしぶといね。いい意味で。",
    30: "30日。ここまで来たら本物じゃん。ちょっと悔しいけどすごい。",
    50: "50日連続。……さすがにこれは認めるしかないね。",
    100: "100日。ほんとにやったんだ。今日は意地悪言うのやめとく。おめでとう。"
  },
  {
    3: "3日連続。まあ、悪くないスタート。",
    7: "7日続いたね。ちゃんとやってるじゃん。",
    14: "14日。2週間か。継続できてるね。",
    30: "30日連続。ここまで来たの、普通にすごいよ。",
    50: "50日。かなり積み上げたね。よく頑張った。",
    100: "100日。……おめでと。本当に、よく続けたね。"
  }
];

// ===================================
// HTML REFERENCES
// ===================================

const questNameInput = document.getElementById("questName");
const questXpInput = document.getElementById("questXp");
const questDateInput = document.getElementById("questDate");
const addQuestButton = document.getElementById("addQuestButton");
const todayQuestList = document.getElementById("todayQuestList");
const weekPlan = document.getElementById("weekPlan");
const prevWeekButton = document.getElementById("prevWeekButton");
const currentWeekButton = document.getElementById("currentWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const hpText = document.getElementById("hp");
const xpBar = document.getElementById("xpBar");
const hpBar = document.getElementById("hpBar");
const todayText = document.getElementById("todayText");
const weekRangeText = document.getElementById("weekRangeText");
const resetLevelButton = document.getElementById("resetLevelButton");
const operatorImage = document.getElementById("operatorImage");
const operatorName = document.getElementById("operatorName");
const operatorMessage = document.getElementById("operatorMessage");
const operatorShift = document.getElementById("operatorShift");
const nextOperator = document.getElementById("nextOperator");
const playerTitle = document.getElementById("playerTitle");
const titleSubText = document.getElementById("titleSubText");
const currentStreakText = document.getElementById("currentStreak");
const bestStreakText = document.getElementById("bestStreak");
const bestStreakSub = document.getElementById("bestStreakSub");
const nextRewardLevel = document.getElementById("nextRewardLevel");
const nextRewardXp = document.getElementById("nextRewardXp");
const nextRewardName = document.getElementById("nextRewardName");
const nextRewardDescription = document.getElementById("nextRewardDescription");
const myRewardInput = document.getElementById("myRewardInput");
const saveRewardButton = document.getElementById("saveRewardButton");
const savedRewardText = document.getElementById("savedRewardText");
const rewardBadges = document.getElementById("rewardBadges");
const themeSelect = document.getElementById("themeSelect");
const achievementToast = document.getElementById("achievementToast");
const achievementKicker = document.getElementById("achievementKicker");
const achievementTitle = document.getElementById("achievementTitle");
const achievementText = document.getElementById("achievementText");
const operatorMini = document.querySelector(".operator-mini");
const fullScreenEvent = document.getElementById("fullScreenEvent");
const eventKicker = document.getElementById("eventKicker");
const eventTitle = document.getElementById("eventTitle");
const eventSubtitle = document.getElementById("eventSubtitle");
const eventOperatorWrap = document.getElementById("eventOperatorWrap");
const eventOperatorImage = document.getElementById("eventOperatorImage");
const eventOperatorName = document.getElementById("eventOperatorName");
const eventMessage = document.getElementById("eventMessage");
const eventSkipButton = document.getElementById("eventSkipButton");

// ===================================
// DATE HELPERS
// ===================================

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getToday() {
  return formatDate(new Date());
}

function createDateFromString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function displayDate(dateString) {
  const date = createDateFromString(dateString);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
}

function daysBetween(a, b) {
  const start = createDateFromString(a);
  const end = createDateFromString(b);
  return Math.round((end - start) / 86400000);
}

// ===================================
// DATA SAVE / MIGRATION
// ===================================

function saveQuests() {
  localStorage.setItem("quests", JSON.stringify(quests));
}

let migrated = false;
quests.forEach(quest => {
  if (!quest.date) {
    quest.date = getToday();
    migrated = true;
  }
  if (typeof quest.completed !== "boolean") {
    quest.completed = false;
    migrated = true;
  }
  if (typeof quest.failed !== "boolean") {
    quest.failed = false;
    migrated = true;
  }
});
if (migrated) saveQuests();

// ===================================
// STREAK SYSTEM
// ===================================

const dailyCompletionLogKey = "dailyCompletionLogV3";
let dailyCompletionLog = JSON.parse(localStorage.getItem(dailyCompletionLogKey) || "{}") || {};

function syncDailyCompletionLog() {
  const today = getToday();
  const dates = [...new Set(quests.filter(q => q.date <= today).map(q => q.date))];

  dates.forEach(date => {
    const dayQuests = quests.filter(q => q.date === date);
    if (dayQuests.length === 0) {
      delete dailyCompletionLog[date];
      return;
    }

    if (dayQuests.some(q => q.failed)) {
      dailyCompletionLog[date] = "failed";
      return;
    }

    if (dayQuests.every(q => q.completed)) {
      dailyCompletionLog[date] = "complete";
      return;
    }

    if (date < today) dailyCompletionLog[date] = "missed";
    else delete dailyCompletionLog[date];
  });

  Object.keys(dailyCompletionLog).forEach(date => {
    if (!quests.some(q => q.date === date)) delete dailyCompletionLog[date];
  });

  localStorage.setItem(dailyCompletionLogKey, JSON.stringify(dailyCompletionLog));
}

function calculateDailyStreak() {
  syncDailyCompletionLog();
  const dates = Object.keys(dailyCompletionLog).sort();
  let streak = 0;

  for (const date of dates) {
    const status = dailyCompletionLog[date];
    if (status === "complete") streak += 1;
    else if (status === "failed" || status === "missed") streak = 0;
  }

  return streak;
}

function calculateHistoricalBestStreak() {
  syncDailyCompletionLog();
  const dates = Object.keys(dailyCompletionLog).sort();
  let run = 0;
  let best = 0;

  for (const date of dates) {
    const status = dailyCompletionLog[date];
    if (status === "complete") {
      run += 1;
      best = Math.max(best, run);
    } else if (status === "failed" || status === "missed") {
      run = 0;
    }
  }

  return best;
}

function refreshStreakData() {
  const current = calculateDailyStreak();
  const calculatedBest = calculateHistoricalBestStreak();
  bestDailyStreak = Math.max(bestDailyStreak, calculatedBest, current);
  localStorage.setItem("bestDailyStreak", String(bestDailyStreak));

  currentStreakText.textContent = `🔥 ${current} ${current === 1 ? "DAY" : "DAYS"}`;
  bestStreakText.textContent = `🏆 ${bestDailyStreak} ${bestDailyStreak === 1 ? "DAY" : "DAYS"}`;
  bestStreakSub.textContent = current === bestDailyStreak && current > 0 ? "CURRENT RECORD" : "PERSONAL RECORD";

  return { current, best: bestDailyStreak };
}

// ===================================
// OPERATOR ROTATION / MESSAGE HELPERS
// ===================================

function getUnlockedOperators(level = getLevelFromScore(score)) {
  return operators.filter(operator => operator.unlockLevel <= level);
}

function getOperatorIndex() {
  const unlocked = getUnlockedOperators();
  const start = new Date(2026, 8, 27, 0, 0, 0);
  const fourHours = 4 * 60 * 60 * 1000;
  const blocksPassed = Math.floor((Date.now() - start.getTime()) / fourHours);
  return ((blocksPassed % unlocked.length) + unlocked.length) % unlocked.length;
}

function getCurrentOperator() {
  const unlocked = getUnlockedOperators();
  return unlocked[getOperatorIndex()];
}

function getShiftText() {
  const hour = new Date().getHours();
  const startHour = Math.floor(hour / 4) * 4;
  const endHour = startHour + 3;

  function to12Hour(h) {
    const period = h < 12 ? "AM" : "PM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return displayHour + ":00 " + period;
  }

  function to12HourEnd(h) {
    const period = h < 12 ? "AM" : "PM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return displayHour + ":59 " + period;
  }

  return to12Hour(startHour) + " — " + to12HourEnd(endHour);
}

function getTimePeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

const recentMessages = {};
function randomMessage(array, key = "default") {
  if (!Array.isArray(array) || array.length === 0) return "SYSTEM READY";
  if (array.length === 1) return array[0];

  let candidate;
  let attempts = 0;
  do {
    candidate = array[Math.floor(Math.random() * array.length)];
    attempts += 1;
  } while (candidate === recentMessages[key] && attempts < 8);

  recentMessages[key] = candidate;
  return candidate;
}

function fillTemplate(text, values = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function getTodayProgress() {
  const todays = quests.filter(q => q.date === getToday());
  const completed = todays.filter(q => q.completed).length;
  return {
    total: todays.length,
    completed,
    rate: todays.length === 0 ? 0 : completed / todays.length
  };
}

let operatorReturnTimer = null;
let operatorQueueTimer = null;

function setOperatorVisual(imageState, message) {
  const current = getCurrentOperator();
  operatorName.textContent = current.name;
  operatorShift.textContent = getShiftText();
  const unlocked = getUnlockedOperators();
  const nextIndex = (getOperatorIndex() + 1) % unlocked.length;
  nextOperator.textContent = `NEXT // ${unlocked[nextIndex].name}`;
  operatorImage.src = current.images[imageState] || current.images.normal;
  operatorMessage.textContent = message;
}

function showOperator(state = "idle", payload = {}) {
  const current = getCurrentOperator();
  const key = `${current.name}-${state}`;

  if (state === "custom") {
    setOperatorVisual(payload.image || "happy", payload.message || "");
    return;
  }

  const stateMap = {
    daily: ["casual", "daily"],
    add: ["casual", "add"],
    success: ["happy", "success"],
    questStreak: ["happy", "questStreak"],
    fail: ["serious", "fail"],
    complete: ["happy", "complete"],
    levelUp: ["happy", "levelUp"],
    talk: ["casual", "talk"]
  };

  if (stateMap[state]) {
    const [imageState, messageKey] = stateMap[state];
    setOperatorVisual(imageState, randomMessage(current.messages[messageKey], key));
    return;
  }

  if (hp <= 30) {
    setOperatorVisual("serious", randomMessage(current.messages.lowHp, `${current.name}-lowHp`));
    return;
  }

  const progress = getTodayProgress();
  if (progress.total === 0) {
    setOperatorVisual("casual", randomMessage(current.messages.noQuest, `${current.name}-noQuest`));
    return;
  }
  if (progress.completed === progress.total) {
    setOperatorVisual("happy", randomMessage(current.messages.complete, `${current.name}-complete`));
    return;
  }
  if (progress.rate >= 0.75) {
    setOperatorVisual("normal", randomMessage(current.messages.almost, `${current.name}-almost`));
    return;
  }
  if (progress.rate >= 0.5) {
    setOperatorVisual("normal", randomMessage(current.messages.half, `${current.name}-half`));
    return;
  }

  const period = getTimePeriod();
  setOperatorVisual(period === "night" ? "casual" : "normal", randomMessage(current.messages[period], `${current.name}-${period}`));
}

function temporaryOperatorState(state, duration = 7000, payload = {}) {
  clearTimeout(operatorReturnTimer);
  showOperator(state, payload);
  operatorReturnTimer = setTimeout(() => showOperator("idle"), duration);
}

function queueOperatorEvents(events) {
  clearTimeout(operatorQueueTimer);
  clearTimeout(operatorReturnTimer);
  if (!events.length) return;

  let index = 0;
  const run = () => {
    if (index >= events.length) {
      showOperator("idle");
      return;
    }
    const event = events[index++];
    showOperator(event.state || "custom", event.payload || {});
    operatorQueueTimer = setTimeout(run, event.duration || 5200);
  };
  run();
}

function getStreakCelebrationMessage(streak) {
  const current = getCurrentOperator();
  const operatorIndex = operators.indexOf(current);
  const hour = new Date().getHours();

  if (hour >= 23 && streak >= 7) {
    return fillTemplate(randomMessage(current.messages.lateNightStreak, `${current.name}-lateNightStreak`), { n: streak });
  }

  if (milestoneMessages[operatorIndex][streak]) {
    return milestoneMessages[operatorIndex][streak];
  }

  return fillTemplate(randomMessage(current.messages.dailyStreak, `${current.name}-dailyStreak`), { n: streak });
}

function getBestStreakMessage(streak) {
  const current = getCurrentOperator();
  return fillTemplate(randomMessage(current.messages.bestStreak, `${current.name}-bestStreak`), { n: streak });
}

function getRewardMessage(reward) {
  const current = getCurrentOperator();
  return fillTemplate(randomMessage(current.messages.rewardUnlock, `${current.name}-rewardUnlock`), {
    level: reward.level,
    reward: reward.name
  });
}

// ===================================
// FULL SCREEN EVENT SYSTEM
// ===================================

let fullScreenEventQueue = [];
let fullScreenEventRunning = false;
let fullScreenEventTimer = null;

function showFullScreenEvent(event) {
  fullScreenEvent.dataset.accent = event.accent || "cyan";
  eventKicker.textContent = event.kicker || "SYSTEM EVENT";
  eventTitle.textContent = event.title || "MISSION UPDATE";
  eventSubtitle.textContent = event.subtitle || "";
  eventMessage.textContent = event.message || "";

  if (event.image) {
    eventOperatorWrap.classList.remove("no-image");
    eventOperatorImage.src = event.image;
    eventOperatorName.textContent = event.operatorName || "";
  } else {
    eventOperatorWrap.classList.add("no-image");
    eventOperatorImage.removeAttribute("src");
    eventOperatorName.textContent = event.operatorName || "";
  }

  fullScreenEvent.classList.add("show");
  fullScreenEvent.setAttribute("aria-hidden", "false");
}

function hideFullScreenEvent() {
  fullScreenEvent.classList.remove("show");
  fullScreenEvent.setAttribute("aria-hidden", "true");
}

function runNextFullScreenEvent() {
  clearTimeout(fullScreenEventTimer);

  if (fullScreenEventQueue.length === 0) {
    hideFullScreenEvent();
    fullScreenEventRunning = false;
    showOperator("idle");
    return;
  }

  fullScreenEventRunning = true;
  const event = fullScreenEventQueue.shift();
  showFullScreenEvent(event);
  fullScreenEventTimer = setTimeout(runNextFullScreenEvent, event.duration || 4200);
}

function queueFullScreenEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return;
  fullScreenEventQueue.push(...events);
  if (!fullScreenEventRunning) runNextFullScreenEvent();
}

eventSkipButton.addEventListener("click", runNextFullScreenEvent);

function buildLevelUpEvent(oldLevel, newLevel, operator = getCurrentOperator()) {
  const current = operator;
  return {
    kicker: "LEVEL UP",
    title: `LEVEL ${newLevel}`,
    subtitle: `LEVEL ${oldLevel} → ${newLevel}  //  TOTAL XP ${score}`,
    image: current.images.happy,
    operatorName: current.name,
    message: randomMessage(current.messages.levelUp, `${current.name}-fullscreen-levelup`),
    duration: 4300,
    accent: newLevel >= 75 ? "gold" : newLevel >= 50 ? "violet" : "cyan"
  };
}

function buildOperatorUnlockEvent(operator) {
  return {
    kicker: "NEW OPERATOR UNLOCKED",
    title: operator.name,
    subtitle: `LEVEL ${operator.unlockLevel} REWARD`,
    image: operator.images.happy,
    operatorName: operator.name,
    message: randomMessage(operator.intro || operator.messages.daily, `${operator.name}-intro`),
    duration: 5200,
    accent: operator.unlockLevel >= 50 ? "gold" : "cyan"
  };
}

function buildStreakEvent(streak) {
  const current = getCurrentOperator();
  return {
    kicker: "STREAK MILESTONE",
    title: `${streak} DAYS`,
    subtitle: "DAILY CLEAR STREAK",
    image: current.images.happy,
    operatorName: current.name,
    message: getStreakCelebrationMessage(streak),
    duration: 5200,
    accent: streak >= 30 ? "gold" : "cyan"
  };
}

function buildLevel100Events() {
  const messages = [
    "ここまで来たんだ。長かったね。",
    "100って……ほんとに行くとは思わなかった。",
    "積み重ねた結果だね。よく続けたよ。",
    "LEVEL 100！！これはさすがに祝うしかないでしょ！",
    "え、100！？ちょっと待って、普通にすごすぎ笑",
    "ここまで続いたんだね。おめでとう。"
  ];

  const events = [{
    kicker: "MASTER RANK ACHIEVED",
    title: "LEVEL 100",
    subtitle: "SPECIAL TRANSMISSION // INITIAL OPERATOR TEAM",
    message: "初期オペレーター6名から通信が入っています。",
    duration: 3200,
    accent: "gold"
  }];

  operators.slice(0, 6).forEach((operator, index) => {
    events.push({
      kicker: `SPECIAL TRANSMISSION 0${index + 1}/06`,
      title: operator.name,
      subtitle: "LEVEL 100 CELEBRATION",
      image: operator.images.happy,
      operatorName: operator.name,
      message: messages[index],
      duration: 4300,
      accent: "gold"
    });
  });

  events.push({
    kicker: "MASTER REWARD UNLOCKED",
    title: "MASTER PACKAGE",
    subtitle: "ALT COSTUMES // MASTER VOICE SET",
    message: "初期6人の新衣装とLv.100限定ボイスを追加できる状態になりました。",
    duration: 5200,
    accent: "gold"
  });

  return events;
}

// ===================================
// EFFECTS / TOAST
// ===================================

function playLevelUpEffect() {
  const playerPanel = document.querySelector(".player");
  playerPanel.classList.remove("level-up-effect");
  xpBar.classList.remove("level-up-effect");
  void playerPanel.offsetWidth;
  playerPanel.classList.add("level-up-effect");
  xpBar.classList.add("level-up-effect");
  setTimeout(() => {
    playerPanel.classList.remove("level-up-effect");
    xpBar.classList.remove("level-up-effect");
  }, 1500);
}

function playStreakCelebration() {
  const playerPanel = document.querySelector(".player");
  playerPanel.classList.remove("streak-celebration");
  operatorMini.classList.remove("operator-celebration");
  void playerPanel.offsetWidth;
  playerPanel.classList.add("streak-celebration");
  operatorMini.classList.add("operator-celebration");
  setTimeout(() => {
    playerPanel.classList.remove("streak-celebration");
    operatorMini.classList.remove("operator-celebration");
  }, 2600);
}

let toastTimer = null;
function showAchievement(kicker, title, text) {
  achievementKicker.textContent = kicker;
  achievementTitle.textContent = title;
  achievementText.textContent = text;
  achievementToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => achievementToast.classList.remove("show"), 4300);
}

// ===================================
// PLAYER / REWARD UI
// ===================================

function renderThemeSelect(level) {
  themeSelect.innerHTML = "";
  themes.forEach(theme => {
    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = level >= theme.level ? theme.label : `${theme.label} // Lv.${theme.level} LOCKED`;
    option.disabled = level < theme.level;
    themeSelect.appendChild(option);
  });

  const selected = themes.find(t => t.id === selectedTheme);
  if (!selected || level < selected.level) selectedTheme = "cyan";
  themeSelect.value = selectedTheme;
  document.body.dataset.theme = selectedTheme;
  localStorage.setItem("selectedTheme", selectedTheme);
}

function renderRewardBadges(level) {
  rewardBadges.innerHTML = "";
  rewards.forEach(reward => {
    const badge = document.createElement("span");
    badge.className = "reward-badge" + (level >= reward.level ? " unlocked" : "");
    badge.textContent = `${level >= reward.level ? "UNLOCKED" : "LOCKED"} // Lv.${reward.level} ${reward.name}`;
    rewardBadges.appendChild(badge);
  });
}

function renderNextReward(level) {
  const next = getNextReward(level);

  if (!next) {
    nextRewardLevel.textContent = "MAX REWARD";
    nextRewardXp.textContent = "ALL UNLOCKED";
    nextRewardName.textContent = "S-RANK COMPLETE";
    nextRewardDescription.textContent = "すべての設定済み報酬を解放済み";
    myRewardInput.value = "";
    myRewardInput.disabled = true;
    saveRewardButton.disabled = true;
    savedRewardText.textContent = "MY REWARD // COMPLETE";
    return;
  }

  myRewardInput.disabled = false;
  saveRewardButton.disabled = false;

  const xpNeeded = Math.max(0, (next.level - 1) * 100 - score);
  nextRewardLevel.textContent = `LEVEL ${next.level}`;
  nextRewardXp.textContent = `あと ${xpNeeded} XP`;
  nextRewardName.textContent = next.name;
  nextRewardDescription.textContent = next.description;

  const ownReward = customRewards[next.level] || "";
  myRewardInput.value = ownReward;
  savedRewardText.textContent = ownReward ? `MY REWARD // ${ownReward}` : "MY REWARD // 未設定";
}

function updatePlayer() {
  const level = getLevelFromScore(score);
  scoreText.textContent = score;
  levelText.textContent = level;
  hpText.textContent = hp;
  xpBar.style.width = `${score % 100}%`;
  hpBar.style.width = `${hp}%`;
  playerTitle.textContent = getTitle(level);
  titleSubText.textContent = `LEVEL ${level} // ${100 - (score % 100 || 100) === 0 ? 0 : 100 - (score % 100)} XP TO NEXT`;

  localStorage.setItem("score", String(score));
  localStorage.setItem("hp", String(hp));

  refreshStreakData();
  renderThemeSelect(level);
  renderRewardBadges(level);
  renderNextReward(level);
}

// ===================================
// TODAY QUESTS
// ===================================

function areTodayQuestsComplete() {
  const todays = quests.filter(q => q.date === getToday());
  return todays.length > 0 && todays.every(q => q.completed);
}

function showTodayQuests() {
  todayQuestList.innerHTML = "";
  const todayQuests = quests.filter(q => q.date === getToday());

  if (todayQuests.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "今日のクエストはありません。";
    todayQuestList.appendChild(message);
    return;
  }

  todayQuests.forEach(quest => {
    const realIndex = quests.indexOf(quest);
    const questBox = document.createElement("div");
    questBox.className = "quest-card";

    const name = document.createElement("div");
    name.className = "quest-name";
    const nameText = document.createElement("span");
    nameText.textContent = quest.name;
    const xpText = document.createElement("span");
    xpText.className = "quest-xp";
    xpText.textContent = `+${quest.xp} XP`;
    name.append(nameText, xpText);

    const clearButton = document.createElement("button");
    clearButton.textContent = quest.completed ? "クリア済み" : "達成";
    clearButton.className = "clear-button";
    clearButton.disabled = quest.completed || quest.failed;

    const failButton = document.createElement("button");
    failButton.textContent = quest.failed ? "失敗済み" : "失敗";
    failButton.className = "fail-button";
    failButton.disabled = quest.completed || quest.failed;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.className = "delete-button";

    clearButton.addEventListener("click", () => {
      if (quest.completed || quest.failed) return;

      const streakBefore = calculateDailyStreak();
      const bestBefore = bestDailyStreak;
      const oldLevel = getLevelFromScore(score);
      const currentOperatorBeforeLevelUp = getCurrentOperator();

      score += quest.xp;
      quest.completed = true;
      questClearStreak += 1;
      localStorage.setItem("questClearStreakV2", String(questClearStreak));

      const newLevel = getLevelFromScore(score);
      const unlockedRewards = getRewardsUnlockedBetween(oldLevel, newLevel);
      const newlyUnlockedOperators = operators.filter(
        operator => operator.unlockLevel > oldLevel && operator.unlockLevel <= newLevel
      );

      saveQuests();
      syncDailyCompletionLog();
      updatePlayer();
      showTodayQuests();
      showWeekPlan();

      const streakAfter = calculateDailyStreak();
      const finishedToday = areTodayQuestsComplete();
      const newBest = bestDailyStreak > bestBefore;
      const fullEvents = [];

      if (newLevel > oldLevel) {
        playLevelUpEffect();
        fullEvents.push(buildLevelUpEvent(oldLevel, newLevel, currentOperatorBeforeLevelUp));

        newlyUnlockedOperators.forEach(operator => {
          fullEvents.push(buildOperatorUnlockEvent(operator));
        });

        if (newLevel >= 100 && oldLevel < 100) {
          fullEvents.push(...buildLevel100Events());
        }

        if (unlockedRewards.length > 0) {
          const reward = unlockedRewards[unlockedRewards.length - 1];
          showAchievement("REWARD UNLOCKED", reward.name, reward.description);
        }
      }

      if (finishedToday && streakAfter > streakBefore) {
        playStreakCelebration();
        const milestone = [3, 7, 14, 30, 50, 100].includes(streakAfter);

        if (milestone) {
          fullEvents.push(buildStreakEvent(streakAfter));
        } else {
          showAchievement("DAILY CLEAR", `${streakAfter} DAY STREAK`, "今日のクエストを全て達成");
        }

        if (newBest && !milestone) {
          temporaryOperatorState("custom", 5200, {
            image: "happy",
            message: getBestStreakMessage(streakAfter)
          });
        }
      }

      if (fullEvents.length > 0) {
        queueFullScreenEvents(fullEvents);
      } else if (finishedToday) {
        temporaryOperatorState("complete");
      } else if (questClearStreak >= 2) {
        temporaryOperatorState("questStreak");
      } else {
        temporaryOperatorState("success");
      }
    });

    failButton.addEventListener("click", () => {
      if (quest.completed || quest.failed) return;
      hp = Math.max(0, hp - 10);
      quest.failed = true;
      questClearStreak = 0;
      localStorage.setItem("questClearStreakV2", "0");
      saveQuests();
      syncDailyCompletionLog();
      updatePlayer();
      showTodayQuests();
      showWeekPlan();
      temporaryOperatorState("fail");
    });

    deleteButton.addEventListener("click", () => {
      if (!confirm(`「${quest.name}」を削除しますか？`)) return;
      quests.splice(realIndex, 1);
      saveQuests();
      syncDailyCompletionLog();
      updatePlayer();
      showTodayQuests();
      showWeekPlan();
      showOperator("idle");
    });

    questBox.append(name, clearButton, failButton, deleteButton);
    todayQuestList.appendChild(questBox);
  });
}

// ===================================
// WEEK PLAN
// ===================================

function getMonday(date) {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = newDate.getDay();
  newDate.setDate(newDate.getDate() + (day === 0 ? -6 : 1 - day));
  return newDate;
}

function getDisplayedMonday() {
  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);
  return monday;
}

function showWeekPlan() {
  weekPlan.innerHTML = "";
  const monday = getDisplayedMonday();
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  weekRangeText.textContent = `${displayDate(formatDate(monday))} 〜 ${displayDate(formatDate(sunday))}`;
  const weekdayNames = ["月", "火", "水", "木", "金", "土", "日"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dateString = formatDate(date);
    const dayColumn = document.createElement("div");
    dayColumn.className = "day-column";
    if (dateString === getToday()) dayColumn.classList.add("today");

    const header = document.createElement("div");
    header.className = "day-header";
    const weekday = document.createElement("div");
    weekday.className = "day-name";
    weekday.textContent = weekdayNames[i];
    const dateNumber = document.createElement("div");
    dateNumber.className = "day-date";
    dateNumber.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
    header.append(weekday, dateNumber);

    if (dateString === getToday()) {
      const label = document.createElement("div");
      label.className = "today-label";
      label.textContent = "TODAY";
      header.appendChild(label);
    }

    dayColumn.appendChild(header);
    const dayQuests = quests.filter(q => q.date === dateString);

    if (dayQuests.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "予定なし";
      dayColumn.appendChild(empty);
    }

    dayQuests.forEach(quest => {
      const box = document.createElement("div");
      box.className = "week-quest";
      if (quest.completed) box.classList.add("completed");
      if (quest.failed) box.classList.add("failed");

      const questName = document.createElement("div");
      questName.className = "week-quest-name";
      questName.textContent = quest.name;
      const xp = document.createElement("div");
      xp.className = "week-quest-xp";
      xp.textContent = `+${quest.xp} XP`;
      box.append(questName, xp);

      if (quest.completed || quest.failed) {
        const status = document.createElement("div");
        status.className = "status-text";
        status.textContent = quest.completed ? "✓ CLEAR" : "FAILED";
        box.appendChild(status);
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "× 削除";
      deleteButton.className = "week-delete-button";
      deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        if (!confirm(`「${quest.name}」を削除しますか？`)) return;
        const index = quests.indexOf(quest);
        if (index !== -1) quests.splice(index, 1);
        saveQuests();
        updatePlayer();
        showTodayQuests();
        showWeekPlan();
        showOperator("idle");
      });
      box.appendChild(deleteButton);
      dayColumn.appendChild(box);
    });

    dayColumn.addEventListener("click", () => {
      questDateInput.value = dateString;
    });

    weekPlan.appendChild(dayColumn);
  }
}

// ===================================
// EVENTS
// ===================================

operatorImage.addEventListener("click", () => {
  const current = getCurrentOperator();
  const currentStreak = calculateDailyStreak();
  const hour = new Date().getHours();

  if (hour >= 23 && currentStreak >= 7 && Math.random() < 0.45) {
    temporaryOperatorState("custom", 7000, {
      image: "casual",
      message: fillTemplate(randomMessage(current.messages.lateNightStreak, `${current.name}-rareTalk`), { n: currentStreak })
    });
  } else {
    temporaryOperatorState("talk", 6000);
  }
});

addQuestButton.addEventListener("click", () => {
  const questName = questNameInput.value.trim();
  const questXp = Number(questXpInput.value);
  const questDate = questDateInput.value;

  if (questName === "" || !Number.isFinite(questXp) || questXp <= 0 || questDate === "") {
    alert("クエスト名・XP・日付を入力してください");
    return;
  }

  quests.push({ name: questName, xp: questXp, date: questDate, completed: false, failed: false });
  saveQuests();
  syncDailyCompletionLog();
  updatePlayer();
  showTodayQuests();
  showWeekPlan();
  questNameInput.value = "";
  questXpInput.value = "";
  temporaryOperatorState("add", 6000);
});

resetLevelButton.addEventListener("click", () => {
  const answer = confirm("LEVELとXPをリセットしますか？\n\nXPは0になり、LEVEL 1に戻ります。\nHP・クエスト・連続記録・MY REWARDは消えません。");
  if (!answer) return;
  score = 0;
  selectedTheme = "cyan";
  updatePlayer();
  alert("LEVEL 1 にリセットしました！");
});

prevWeekButton.addEventListener("click", () => {
  weekOffset--;
  showWeekPlan();
});

currentWeekButton.addEventListener("click", () => {
  weekOffset = 0;
  showWeekPlan();
});

nextWeekButton.addEventListener("click", () => {
  weekOffset++;
  showWeekPlan();
});

themeSelect.addEventListener("change", () => {
  selectedTheme = themeSelect.value;
  document.body.dataset.theme = selectedTheme;
  localStorage.setItem("selectedTheme", selectedTheme);
});

saveRewardButton.addEventListener("click", () => {
  const level = getLevelFromScore(score);
  const next = getNextReward(level);
  if (!next) return;
  const value = myRewardInput.value.trim();

  if (value) customRewards[next.level] = value;
  else delete customRewards[next.level];

  localStorage.setItem("customRewards", JSON.stringify(customRewards));
  renderNextReward(level);
  showAchievement("MY REWARD SAVED", `LEVEL ${next.level}`, value || "MY REWARDを削除しました");
});

// ===================================
// START / GREETING / WATCH
// ===================================

todayText.textContent = displayDate(getToday());
questDateInput.value = getToday();
syncDailyCompletionLog();
updatePlayer();
showTodayQuests();
showWeekPlan();

const lastVisitDate = localStorage.getItem("lastVisitDate");
const lastGreetingDate = localStorage.getItem("lastGreetingDate");

if (lastVisitDate && daysBetween(lastVisitDate, getToday()) >= 3) {
  const current = getCurrentOperator();
  temporaryOperatorState("custom", 8000, {
    image: "casual",
    message: randomMessage(current.messages.comeback, `${current.name}-comeback`)
  });
} else if (lastGreetingDate !== getToday()) {
  showOperator("daily");
  localStorage.setItem("lastGreetingDate", getToday());
} else {
  showOperator("idle");
}

localStorage.setItem("lastVisitDate", getToday());

let lastOperatorIndex = getOperatorIndex();
let lastKnownDate = getToday();

setInterval(() => {
  const newOperatorIndex = getOperatorIndex();
  const newDate = getToday();

  if (newOperatorIndex !== lastOperatorIndex) {
    lastOperatorIndex = newOperatorIndex;
    showOperator("idle");
  }

  if (newDate !== lastKnownDate) {
    lastKnownDate = newDate;
    questClearStreak = 0;
    localStorage.setItem("questClearStreakV2", "0");
    syncDailyCompletionLog();
    todayText.textContent = displayDate(newDate);
    questDateInput.value = newDate;
    updatePlayer();
    showTodayQuests();
    showWeekPlan();
    showOperator("daily");
    localStorage.setItem("lastGreetingDate", newDate);
    localStorage.setItem("lastVisitDate", newDate);
  }
}, 60000);

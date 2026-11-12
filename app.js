/* ============================================================
   PIKO AI — site behaviour
   Pure vanilla JS: no build step, no dependencies, no trackers.
   ============================================================ */

const CONFIG = {
  version: '1.5.3',
  installer: 'https://github.com/black2000a/PIKO-AI-A-APP-DOWNLOAD',
  portable: 'https://github.com/black2000a/PIKO-AI-A-APP-DOWNLOAD',
  github: 'https://github.com/black2000a/Introducing-PIKO-AI-A-Free-AI-Powered-IDE-with-Local-AI-Support',
  ollama: 'https://ollama.com',
  discord: 'https://discord.com/users/1569794818396397741',
  discordHandle: 'taha29dev',
  mail: 'mailto:tahazitoni123@gmail.com',
  sizes: { installer: '175 MB', portable: '150 MB' },
};

/* --------------------------------------------------------- dev message */
const DEV_MESSAGES = {
  ma: {
    lang: 'ar',
    dir: 'rtl',
    greet: `سلام،`,
    p1: `أنا طه، المعروف بـ BLACK2DEV. أنا سعيد جداً بوجودك في موقعي، وأريد أن أرحّب بك في هذا المشروع. هذا المشروع يقدّم لك تحديثاً واحداً كل أسبوع — وإذا كان هناك شيء كبير، ربما كل يومين.`,
    p2: `أريد أن أخبرك أن PIKO AI IDE مجاني تماماً: بدون اشتراك، وبدون تسجيل دخول. يعمل بنماذج محلية من Ollama. ما زال في مرحلة البيتا، وسأواصل تحديثه. وهو مفتوح المصدر بالكامل للمجتمع، لأنني أريد أفكاركم — الكثير من الأفكار — وأن يساهم الكثير منكم في هذا المشروع.`,
    sign: `طه: عمري 17 سنة، ولهذا بنيت هذا الـ IDE. معاً نبني مستقبل العشرين سنة القادمة. سأصنع ثورة في هذا المجال.`,
  },
  fr: {
    lang: 'fr',
    dir: 'ltr',
    greet: `Salut,`,
    p1: `Je suis TAHA, alias BLACK2DEV. Je suis vraiment heureux que tu sois sur mon site, et je veux te souhaiter la bienvenue dans ce projet. Ce projet te donne une mise à jour chaque semaine — et si quelque chose de grand arrive, peut-être tous les deux jours.`,
    p2: `Je veux te dire que PIKO AI IDE est entièrement gratuit : sans abonnement, sans connexion. Il fonctionne avec des modèles locaux via Ollama. Il est encore en bêta, et je continuerai à le mettre à jour. Il est entièrement open source pour la communauté, parce que je veux vos idées — beaucoup d'idées — et que beaucoup d'entre vous contribuent à ce projet.`,
    sign: `TAHA : J'ai 17 ans, c'est pourquoi j'ai créé cet IDE. Ensemble, nous construisons l'avenir des 20 prochaines années. Je vais faire une révolution dans ce domaine.`,
  },
  zh: {
    lang: 'zh-CN',
    dir: 'ltr',
    greet: `你好，`,
    p1: `我是 TAHA，也叫 BLACK2DEV。很高兴你来到我的网站，欢迎来到我的这个项目。这个项目每周为你带来一次更新——如果有大功能，可能每两天一次。`,
    p2: `我想告诉你，PIKO AI IDE 完全免费：没有订阅，没有登录。它通过 Ollama 使用本地模型。它仍处于测试阶段，我会持续更新。它完全开源，面向社区，因为我想要你们的想法——很多想法——也希望你们中很多人参与这个项目。`,
    sign: `TAHA：我今年 17 岁，这就是我做这个 IDE 的原因。我们一起构建未来 20 年。我要在这个领域带来一场革命。`,
  },
  en: {
    lang: 'en',
    dir: 'ltr',
    greet: `Hi,`,
    p1: `I'm TAHA, also known as BLACK2DEV. I'm really happy you're on my website, and I want to welcome you to this project of mine. This project gives you one update every week — and if something big lands, maybe every two days.`,
    p2: `I want to tell you that PIKO AI IDE is completely free: no subscription, no login. It runs on local models from Ollama. It is still in beta, and I will keep updating it. It is fully open source for the community, because I want your ideas — a lot of ideas — and for many of you to contribute to this project.`,
    sign: `TAHA: I'm 17 years old, which is why I built this IDE. Together we are building the future of the next 20 years. I'm going to make a revolution in this field.`,
  },
  es: {
    lang: 'es',
    dir: 'ltr',
    greet: `Hola,`,
    p1: `Soy TAHA, también conocido como BLACK2DEV. Estoy muy feliz de que estés en mi sitio web y quiero darte la bienvenida a este proyecto mío. Este proyecto te da una actualización cada semana — y si llega algo grande, quizá cada dos días.`,
    p2: `Quiero decirte que PIKO AI IDE es totalmente gratis: sin suscripción, sin inicio de sesión. Funciona con modelos locales de Ollama. Todavía está en beta y seguiré actualizándolo. Es totalmente de código abierto para la comunidad, porque quiero vuestras ideas — muchas ideas — y que muchos de vosotros contribuyáis a este proyecto.`,
    sign: `TAHA: Tengo 17 años, por eso hice este IDE. Juntos estamos construyendo el futuro de los próximos 20 años. Voy a hacer una revolución en este campo.`,
  },
  de: {
    lang: 'de',
    dir: 'ltr',
    greet: `Hi,`,
    p1: `ich bin TAHA, auch bekannt als BLACK2DEV. Ich freue mich sehr, dass du auf meiner Website bist, und möchte dich in meinem Projekt willkommen heißen. Dieses Projekt bringt dir jede Woche ein Update — und wenn etwas Großes kommt, vielleicht alle zwei Tage.`,
    p2: `Ich möchte dir sagen, dass PIKO AI IDE völlig kostenlos ist: kein Abo, kein Login. Es läuft mit lokalen Modellen von Ollama. Es ist noch in der Beta und ich werde es weiter aktualisieren. Es ist vollständig Open Source für die Community, weil ich eure Ideen will — viele Ideen — und dass viele von euch zu diesem Projekt beitragen.`,
    sign: `TAHA: Ich bin 17 Jahre alt, deshalb habe ich diese IDE gebaut. Gemeinsam bauen wir die Zukunft der nächsten 20 Jahre. Ich werde in diesem Bereich eine Revolution auslösen.`,
  },
  pt: {
    lang: 'pt-BR',
    dir: 'ltr',
    greet: `Olá,`,
    p1: `Eu sou o TAHA, também conhecido como BLACK2DEV. Fico muito feliz por você estar no meu site e quero te dar as boas-vindas a este projeto. Este projeto te dá uma atualização por semana — e se algo grande chegar, talvez a cada dois dias.`,
    p2: `Quero te dizer que o PIKO AI IDE é totalmente gratuito: sem assinatura, sem login. Ele funciona com modelos locais do Ollama. Ainda está em beta e vou continuar atualizando. É totalmente open source para a comunidade, porque quero as suas ideias — muitas ideias — e que muitos de vocês contribuam com este projeto.`,
    sign: `TAHA: Tenho 17 anos, por isso criei este IDE. Juntos estamos construindo o futuro dos próximos 20 anos. Vou fazer uma revolução nessa área.`,
  },
  it: {
    lang: 'it',
    dir: 'ltr',
    greet: `Ciao,`,
    p1: `sono TAHA, noto anche come BLACK2DEV. Sono davvero felice che tu sia sul mio sito e voglio darti il benvenuto in questo mio progetto. Questo progetto ti offre un aggiornamento ogni settimana — e se arriva qualcosa di grande, forse ogni due giorni.`,
    p2: `Voglio dirti che PIKO AI IDE è completamente gratuito: nessun abbonamento, nessun login. Funziona con modelli locali di Ollama. È ancora in beta e continuerò ad aggiornarlo. È completamente open source per la comunità, perché voglio le vostre idee — tante idee — e che molti di voi contribuiscano a questo progetto.`,
    sign: `TAHA: Ho 17 anni, ed è per questo che ho creato questo IDE. Insieme stiamo costruendo il futuro dei prossimi 20 anni. Farò una rivoluzione in questo campo.`,
  },
  nl: {
    lang: 'nl',
    dir: 'ltr',
    greet: `Hoi,`,
    p1: `ik ben TAHA, ook bekend als BLACK2DEV. Ik ben heel blij dat je op mijn website bent en ik wil je welkom heten bij dit project van mij. Dit project geeft je elke week een update — en als er iets groots komt, misschien elke twee dagen.`,
    p2: `Ik wil je vertellen dat PIKO AI IDE volledig gratis is: geen abonnement, geen login. Het draait op lokale modellen van Ollama. Het is nog in bèta en ik blijf het updaten. Het is volledig open source voor de community, omdat ik jullie ideeën wil — veel ideeën — en dat velen van jullie aan dit project bijdragen.`,
    sign: `TAHA: Ik ben 17 jaar oud, daarom heb ik deze IDE gemaakt. Samen bouwen we de toekomst van de komende 20 jaar. Ik ga een revolutie maken in dit vakgebied.`,
  },
  ru: {
    lang: 'ru',
    dir: 'ltr',
    greet: `Привет,`,
    p1: `я TAHA, также известный как BLACK2DEV. Я очень рад, что ты на моём сайте, и хочу поприветствовать тебя в моём проекте. Этот проект даёт тебе обновление каждую неделю — а если выйдет что-то крупное, возможно, каждые два дня.`,
    p2: `Хочу сказать, что PIKO AI IDE полностью бесплатный: без подписки, без входа. Он работает на локальных моделях Ollama. Он всё ещё в бете, и я продолжу его обновлять. Он полностью открытый для сообщества, потому что я хочу ваши идеи — много идей — и чтобы многие из вас внесли вклад в этот проект.`,
    sign: `TAHA: Мне 17 лет, поэтому я сделал эту IDE. Вместе мы строим будущее следующих 20 лет. Я совершу революцию в этой области.`,
  },
  tr: {
    lang: 'tr',
    dir: 'ltr',
    greet: `Merhaba,`,
    p1: `Ben TAHA, nam-ı diğer BLACK2DEV. Sitemde olduğun için çok mutluyum ve seni bu projeme davet etmek istiyorum. Bu proje sana her hafta bir güncelleme sunuyor — büyük bir şey gelirse belki iki günde bir.`,
    p2: `PIKO AI IDE'nin tamamen ücretsiz olduğunu söylemek istiyorum: abonelik yok, giriş yok. Ollama'dan yerel modellerle çalışıyor. Hâlâ beta aşamasında ve güncellemeye devam edeceğim. Topluluk için tamamen açık kaynak, çünkü fikirlerinizi istiyorum — birçok fikir — ve çoğunuzun bu projeye katkıda bulunmasını istiyorum.`,
    sign: `TAHA: 17 yaşındayım, bu yüzden bu IDE'yi yaptım. Birlikte önümüzdeki 20 yılın geleceğini inşa ediyoruz. Bu alanda bir devrim yapacağım.`,
  },
  hi: {
    lang: 'hi',
    dir: 'ltr',
    greet: `नमस्ते,`,
    p1: `मैं TAHA हूँ, जिसे BLACK2DEV भी कहा जाता है। मुझे बहुत खुशी है कि आप मेरी वेबसाइट पर हैं, और मैं आपका अपने इस प्रोजेक्ट में स्वागत करना चाहता हूँ। यह प्रोजेक्ट आपको हर हफ़्ते एक अपडेट देता है — और अगर कुछ बड़ा आए, तो शायद हर दो दिन में।`,
    p2: `मैं बताना चाहता हूँ कि PIKO AI IDE पूरी तरह मुफ़्त है: कोई सब्सक्रिप्शन नहीं, कोई लॉगिन नहीं। यह Ollama के लोकल मॉडल पर चलता है। यह अभी बीटा में है, और मैं इसे अपडेट करता रहूँगा। यह कम्युनिटी के लिए पूरी तरह ओपन सोर्स है, क्योंकि मुझे आपके विचार चाहिए — बहुत सारे विचार — और चाहता हूँ कि आप में से बहुत लोग इस प्रोजेक्ट में योगदान दें।`,
    sign: `TAHA: मैं 17 साल का हूँ, इसलिए मैंने यह IDE बनाया। हम मिलकर अगले 20 साल का भविष्य बना रहे हैं। मैं इस क्षेत्र में क्रांति लाऊँगा।`,
  },
  ja: {
    lang: 'ja',
    dir: 'ltr',
    greet: `こんにちは、`,
    p1: `私は TAHA、BLACK2DEV としても知られています。私のサイトに来てくれてとても嬉しいです。このプロジェクトへようこそ。このプロジェクトは毎週1回アップデートを届けます。大きな機能が来れば、2日ごとになることもあります。`,
    p2: `PIKO AI IDE は完全無料です：サブスクなし、ログインなし。Ollama のローカルモデルで動きます。まだベータ版で、これからも更新を続けます。コミュニティのために完全オープンソースです。皆さんのアイデアが欲しいです — たくさんのアイデアを — そして多くの方にこのプロジェクトへ参加してほしいです。`,
    sign: `TAHA: 私は17歳で、だからこの IDE を作りました。一緒にこれから20年の未来を作っています。この分野に革命を起こします。`,
  },
  ko: {
    lang: 'ko',
    dir: 'ltr',
    greet: `안녕하세요,`,
    p1: `저는 BLACK2DEV로도 알려진 TAHA입니다. 제 웹사이트에 와 주셔서 정말 기쁘고, 이 프로젝트에 오신 것을 환영합니다. 이 프로젝트는 매주 한 번 업데이트를 제공합니다. 큰 기능이 있으면 이틀마다 업데이트될 수도 있습니다.`,
    p2: `PIKO AI IDE는 완전히 무료입니다: 구독 없음, 로그인 없음. Ollama의 로컬 모델로 실행됩니다. 아직 베타이며 계속 업데이트할 것입니다. 커뮤니티를 위해 완전한 오픈 소스입니다. 여러분의 아이디어를 원합니다 — 많은 아이디어를 — 그리고 많은 분이 이 프로젝트에 참여해 주길 바랍니다.`,
    sign: `TAHA: 저는 17살이고, 그래서 이 IDE를 만들었습니다. 우리는 함께 앞으로 20년의 미래를 만듭니다. 이 분야에 혁명을 일으키겠습니다.`,
  },
  pl: {
    lang: 'pl',
    dir: 'ltr',
    greet: `Cześć,`,
    p1: `jestem TAHA, znany też jako BLACK2DEV. Bardzo się cieszę, że jesteś na mojej stronie, i chcę cię powitać w moim projekcie. Ten projekt daje ci aktualizację co tydzień — a jeśli pojawi się coś dużego, może co dwa dni.`,
    p2: `Chcę ci powiedzieć, że PIKO AI IDE jest całkowicie darmowe: bez subskrypcji, bez logowania. Działa na lokalnych modelach z Ollama. Wciąż jest w becie i będę je aktualizować. Jest w pełni open source dla społeczności, bo chcę waszych pomysłów — wielu pomysłów — i tego, by wielu z was wniosło wkład w ten projekt.`,
    sign: `TAHA: Mam 17 lat, dlatego zrobiłem to IDE. Razem budujemy przyszłość następnych 20 lat. Zrobię rewolucję w tej dziedzinie.`,
  },
  uk: {
    lang: 'uk',
    dir: 'ltr',
    greet: `Привіт,`,
    p1: `я TAHA, також відомий як BLACK2DEV. Я дуже радий, що ти на моєму сайті, і хочу привітати тебе в моєму проєкті. Цей проєкт дає тобі оновлення щотижня — а якщо вийде щось велике, можливо, кожні два дні.`,
    p2: `Хочу сказати, що PIKO AI IDE повністю безкоштовний: без підписки, без входу. Він працює на локальних моделях Ollama. Він ще в беті, і я продовжу його оновлювати. Він повністю відкритий для спільноти, бо я хочу ваші ідеї — багато ідей — і щоб багато з вас долучилися до цього проєкту.`,
    sign: `TAHA: Мені 17 років, тому я зробив цю IDE. Разом ми будуємо майбутнє наступних 20 років. Я здійсню революцію в цій галузі.`,
  },
  id: {
    lang: 'id',
    dir: 'ltr',
    greet: `Halo,`,
    p1: `saya TAHA, juga dikenal sebagai BLACK2DEV. Saya sangat senang kamu ada di situs saya, dan saya ingin menyambutmu di proyek saya ini. Proyek ini memberimu satu pembaruan setiap minggu — dan jika ada sesuatu yang besar, mungkin setiap dua hari.`,
    p2: `Saya ingin memberitahumu bahwa PIKO AI IDE sepenuhnya gratis: tanpa langganan, tanpa login. Ini berjalan dengan model lokal dari Ollama. Masih dalam beta, dan saya akan terus memperbaruinya. Ini sepenuhnya open source untuk komunitas, karena saya ingin ide-ide kalian — banyak ide — dan agar banyak dari kalian berkontribusi pada proyek ini.`,
    sign: `TAHA: Saya berusia 17 tahun, itulah sebabnya saya membuat IDE ini. Bersama-sama kita membangun masa depan 20 tahun ke depan. Saya akan membuat revolusi di bidang ini.`,
  },
  vi: {
    lang: 'vi',
    dir: 'ltr',
    greet: `Xin chào,`,
    p1: `Tôi là TAHA, còn được biết đến là BLACK2DEV. Tôi rất vui vì bạn đang ở trên trang web của tôi, và tôi muốn chào mừng bạn đến với dự án này của tôi. Dự án này mang đến cho bạn một bản cập nhật mỗi tuần — và nếu có điều gì lớn, có thể mỗi hai ngày.`,
    p2: `Tôi muốn nói với bạn rằng PIKO AI IDE hoàn toàn miễn phí: không đăng ký, không đăng nhập. Nó chạy trên các mô hình cục bộ từ Ollama. Nó vẫn đang trong bản beta và tôi sẽ tiếp tục cập nhật. Nó hoàn toàn mã nguồn mở cho cộng đồng, vì tôi muốn ý tưởng của các bạn — thật nhiều ý tưởng — và mong nhiều bạn đóng góp cho dự án này.`,
    sign: `TAHA: Tôi 17 tuổi, đó là lý do tôi tạo ra IDE này. Cùng nhau, chúng ta đang xây dựng tương lai của 20 năm tới. Tôi sẽ tạo ra một cuộc cách mạng trong lĩnh vực này.`,
  },
  fa: {
    lang: 'fa',
    dir: 'rtl',
    greet: `سلام،`,
    p1: `من TAHA هستم، با نام BLACK2DEV. خیلی خوشحالم که در وب‌سایت من هستی و می‌خواهم تو را به این پروژه‌ام خوش‌آمد بگویم. این پروژه هر هفته یک به‌روزرسانی به تو می‌دهد — و اگر چیز بزرگی بیاید، شاید هر دو روز.`,
    p2: `می‌خواهم بگویم که PIKO AI IDE کاملاً رایگان است: بدون اشتراک، بدون ورود. با مدل‌های محلی Ollama کار می‌کند. هنوز در بتاست و به به‌روزرسانی آن ادامه می‌دهم. برای جامعه کاملاً متن‌باز است، چون ایده‌های شما را می‌خواهم — ایده‌های زیادی — و می‌خواهم بسیاری از شما در این پروژه مشارکت کنید.`,
    sign: `TAHA: من ۱۷ ساله هستم، به همین دلیل این IDE را ساختم. با هم آینده ۲۰ سال بعد را می‌سازیم. در این حوزه انقلابی به پا خواهم کرد.`,
  },
  he: {
    lang: 'he',
    dir: 'rtl',
    greet: `היי,`,
    p1: `אני TAHA, מוכר גם כ-BLACK2DEV. אני ממש שמח שאתה באתר שלי, ואני רוצה לברך אותך לפרויקט הזה שלי. הפרויקט הזה נותן לך עדכון כל שבוע — ואם מגיע משהו גדול, אולי כל יומיים.`,
    p2: `אני רוצה לומר לך ש-PIKO AI IDE חינמי לגמרי: בלי מנוי, בלי התחברות. הוא פועל עם מודלים מקומיים מ-Ollama. הוא עדיין בבטא, ואמשיך לעדכן אותו. הוא קוד פתוח לחלוטין לקהילה, כי אני רוצה את הרעיונות שלכם — הרבה רעיונות — ושרבים מכם יתרמו לפרויקט הזה.`,
    sign: `TAHA: אני בן 17, ולכן בניתי את ה-IDE הזה. ביחד אנחנו בונים את העתיד של 20 השנים הבאות. אני אעשה מהפכה בתחום הזה.`,
  },
};

(function () {
  'use strict';

  /* --------------------------------------------------------- downloads */
  document.querySelectorAll('[data-installer]').forEach((el) => {
    el.setAttribute('href', CONFIG.installer);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-portable]').forEach((el) => {
    el.setAttribute('href', CONFIG.portable);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-installer-size]').forEach((el) => {
    el.textContent = CONFIG.sizes.installer;
  });
  document.querySelectorAll('[data-portable-size]').forEach((el) => {
    el.textContent = CONFIG.sizes.portable;
  });
  document.querySelectorAll('[data-version]').forEach((el) => {
    el.textContent = 'v' + CONFIG.version;
  });

  /* ------------------------------------------------------------- links */
  document.querySelectorAll('[data-github]').forEach((el) => {
    el.setAttribute('href', CONFIG.github);
  });
  document.querySelectorAll('[data-ollama]').forEach((el) => {
    el.setAttribute('href', CONFIG.ollama);
  });
  document.querySelectorAll('[data-discord]').forEach((el) => {
    el.setAttribute('href', CONFIG.discord);
  });
  document.querySelectorAll('[data-discord-handle]').forEach((el) => {
    el.textContent = CONFIG.discordHandle;
  });
  document.querySelectorAll('[data-mail]').forEach((el) => {
    el.setAttribute('href', CONFIG.mail);
  });

  /* --------------------------------------------------- developer message */
  const devCard = document.getElementById('devCard');
  const devMsg = document.getElementById('devMsg');
  const devSign = document.getElementById('devSign');
  const langChips = document.querySelectorAll('.lang-chip');

  const renderDevMessage = (code) => {
    const entry = DEV_MESSAGES[code];
    if (!entry || !devCard || !devMsg || !devSign) return;

    devCard.setAttribute('lang', entry.lang);
    devCard.setAttribute('dir', entry.dir);

    devMsg.replaceChildren();
    const greet = document.createElement('p');
    greet.className = 'dev-greet';
    greet.textContent = entry.greet;
    devMsg.append(greet);

    [entry.p1, entry.p2].forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      devMsg.append(p);
    });

    devSign.textContent = entry.sign;
    langChips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.lang === code));
    });
  };

  langChips.forEach((chip) => {
    chip.addEventListener('click', () => renderDevMessage(chip.dataset.lang));
  });

  renderDevMessage('ma');

  /* --------------------------------------------------------------- year */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------- nav state */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // the bar has no plate, so it tucks away on scroll down and returns
  // as soon as the page is scrolled back up
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);

    const delta = y - lastScrollY;
    const menuOpen = links && links.classList.contains('open');
    if (y < 120 || menuOpen || delta < -4) {
      nav.classList.remove('nav-hidden');
    } else if (delta > 4) {
      nav.classList.add('nav-hidden');
    }
    lastScrollY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // desktop users can also bring the transparent bar back by moving
  // the pointer to the top edge, and keyboard focus reveals it too
  document.addEventListener(
    'mousemove',
    (event) => {
      if (nav && event.clientY <= 10) nav.classList.remove('nav-hidden');
    },
    { passive: true }
  );
  if (nav) {
    nav.addEventListener('focusin', () => nav.classList.remove('nav-hidden'));
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ------------------------------------------------------- scroll reveal */
  const targets = document.querySelectorAll('.section-copy, .int-card, .demo-frame, .download-inner');

  if ('IntersectionObserver' in window) {
    targets.forEach((el) => el.classList.add('reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------- micro-interaction */
  // the centre app tile follows the pointer a little, like a lit surface
  const appTile = document.querySelector('.hero-app');
  const beam = document.querySelector('.beam');
  if (appTile && beam && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    beam.addEventListener('pointermove', (event) => {
      const rect = beam.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      appTile.style.transform = `translate(calc(-50% + ${(x * 18).toFixed(1)}px), calc(-50% + ${(y * 14).toFixed(1)}px))`;
    });
    beam.addEventListener('pointerleave', () => {
      appTile.style.transform = 'translate(-50%, -50%)';
    });
  }
})();

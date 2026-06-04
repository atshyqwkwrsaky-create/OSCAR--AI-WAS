const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const deco = require('../../utils/decorations');

module.exports.config = {
    name: "احداث",
    version: "2.2.0",
    hasPermssion: 1,
    credits: "داروين",
    description: "أحداث المجموعة - ترحيب، مغادرة، إشعارات الأدمن، حدث الاتصال",
    commandCategory: "الادمــــن",
    usages: "تلقائي",
    cooldowns: 5,
};

const ADMIN_ID = "61563738496733";
const BOT_NAME = "OSCAR Bot";
const DEV_NAME = "داروين";

// ─── حدث الاتصال عند بدء تشغيل البوت ───
const startupFlagPath = path.join(__dirname, "..", "..", "logs", ".startup_sent");
let startupSent = false;

async function sendStartupNotification(api) {
    if (startupSent) return;
    if (fs.existsSync(startupFlagPath)) {
        const lastTime = parseInt(fs.readFileSync(startupFlagPath, "utf8") || "0");
        if (Date.now() - lastTime < 60000) return;
    }
    startupSent = true;
    fs.ensureDirSync(path.dirname(startupFlagPath));
    fs.writeFileSync(startupFlagPath, String(Date.now()), "utf8");

    const now = new Date().toLocaleString('ar-SA', { timeZone: 'Africa/Khartoum' });
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600).toString().padStart(2, '0');
    const m = Math.floor((uptime % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(uptime % 60).toString().padStart(2, '0');

    const msg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🌐 تـم الاتـصـال ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇
┇  ✦ ${BOT_NAME} ✦
┇  متصل ويعمل بشكل طبيعي ✅
┇
┝━━━━ 📡 معلومات الاتصال ━━━━
┇ 🕐 الوقت    ⟫ ${now}
┇ ⏱️ التشغيل  ⟫ ${h}:${m}:${s}
┇ 🟢 الحالة   ⟫ نشط ومتصل
┇
┝━━━━ 👑 المطور ━━━━━━━━━━━
┇ الاسم ⟫ ${DEV_NAME}
┇ 🇸🇩 السودان
┇
●━━━━━━━━━━━━━━━━━━━━━●
  🌟 ${BOT_NAME} في الخدمة 🌟
●━━━━━━━━━━━━━━━━━━━━━●`;

    try {
        await api.sendMessage(msg, ADMIN_ID);
    } catch (e) {
        console.error("فشل إرسال إشعار الاتصال:", e.message);
    }
}

module.exports.HakimEvent = async function ({ api, event }) {
    const { logMessageType, logMessageData, author, threadID } = event;
    const botID = api.getCurrentUserID();

    // ─── إرسال إشعار الاتصال عند أول حدث ───
    sendStartupNotification(api);

    try {
        switch (logMessageType) {

            // ─── دخول أعضاء (أو البوت نفسه) ───
            case "log:subscribe": {

                // حالة: البوت هو من أُضيف للمجموعة
                if (logMessageData.addedParticipants.some(p => String(p.userFbId) === String(botID))) {

                    // تغيير الكنية
                    try {
                        await api.changeNickname(`✦ 𝙊𝙎𝘾𝘼𝙍 𝘽𝙤𝙩 ✦`, threadID, botID);
                    } catch (e) {
                        console.error("فشل تغيير الكنية:", e.message);
                    }

                    const arrivalMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🌐 تـم الاتـصـال ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇
┇  ✦ ${BOT_NAME} ✦
┇  وصل وجاهز للخدمة 🤖
┇
┝━━━━━━━━━━━━━━━━━━━━━
┇ 👑 المطور  ⟫ ${DEV_NAME}
┇ 🌍 البلد   ⟫ 🇸🇩 السودان
┇ 📋 الأوامر ⟫ اكتب [ اوامر ]
┇
●━━━━━━━━━━━━━━━━━━━━━●
  🌟 أهلاً وسهلاً بكم 🌟
●━━━━━━━━━━━━━━━━━━━━━●`;

                    await api.sendMessage(arrivalMsg, threadID);
                    return;
                }

                // حالة: عضو عادي انضم - تجاهل أحداث البوت الأخرى
                if (author === botID) return;

                for (const participant of logMessageData.addedParticipants) {
                    const { userFbId, fullName } = participant;
                    try {
                        const threadInfo = await api.getThreadInfo(threadID);
                        const memberCount = threadInfo.participantIDs.length;

                        const backgrounds = [
                            "https://i.imgur.com/dDSh0wc.jpeg",
                            "https://i.imgur.com/UucSRWJ.jpeg",
                            "https://i.imgur.com/OYzHKNE.jpeg",
                            "https://i.imgur.com/V5L9dPi.jpeg",
                            "https://i.imgur.com/M7HEAMA.jpeg"
                        ];
                        const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
                        const avatar = `https://graph.facebook.com/${userFbId}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                        const apiUrl = `https://kaiz-apis.gleeze.com/api/welcomecard?background=${encodeURIComponent(background)}&text1=${encodeURIComponent(fullName)}&text2=${encodeURIComponent('نورت المجموعة يا أسطورة')}&text3=${encodeURIComponent(`أنت العضو رقم ${memberCount}`)}&avatar=${encodeURIComponent(avatar)}`;

                        const cacheDir = path.join(__dirname, 'cache');
                        fs.ensureDirSync(cacheDir);
                        const imagePath = path.join(cacheDir, `welcome-${userFbId}.png`);
                        const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 10000 });
                        fs.writeFileSync(imagePath, response.data);

                        const welcomeMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🎉 عـضـو جـديـد ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 👤 الاسم   ⟫ ${fullName}
┇ 🏅 العضو   ⟫ رقم ${memberCount}
┇ ✨ نورت المجموعة يا أسطورة
●━━━━━━━━━━━━━━━━━━━━━●`;

                        api.sendMessage(
                            { body: welcomeMsg, attachment: fs.createReadStream(imagePath) },
                            threadID,
                            () => { try { fs.unlinkSync(imagePath); } catch (e) {} }
                        );
                    } catch (e) {
                        const welcomeMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🎉 عـضـو جـديـد ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 👤 ${fullName}
┇ ✨ نورت المجموعة!
●━━━━━━━━━━━━━━━━━━━━━●`;
                        api.sendMessage(welcomeMsg, threadID);
                    }
                }
                break;
            }

            // ─── مغادرة عضو ───
            case "log:unsubscribe": {
                if (author === botID) return;
                const leftID = logMessageData.leftParticipantFbId;
                if (String(leftID) === String(botID)) return;
                try {
                    const userInfo = await api.getUserInfo(leftID);
                    const userName = userInfo[leftID]?.name || "عضو";
                    const leaveMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 👋 مـغـادرة عـضـو ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 👤 الاسم ⟫ ${userName}
┇ 💨 غادر/ت المجموعة
┇ 🙏 وداعاً ونتمنى العودة
●━━━━━━━━━━━━━━━━━━━━━●`;
                    api.sendMessage(leaveMsg, threadID);
                } catch (e) {
                    api.sendMessage(
`●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 👋 مـغـادرة عـضـو ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 💨 أحد الأعضاء غادر المجموعة
●━━━━━━━━━━━━━━━━━━━━━●`, threadID);
                }
                break;
            }

            // ─── تغيير الأدمن ───
            case "log:thread-admins": {
                if (author === botID) return;
                const targetID = logMessageData.TARGET_ID;
                const adminAction = logMessageData.ADMIN_EVENT;
                try {
                    const userInfo = await api.getUserInfo(targetID);
                    const userName = userInfo[targetID]?.name || "عضو";
                    let adminMsg = "";
                    if (adminAction === "add_admin") {
                        adminMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ ⭐ تـرقـيـة أدمـن ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 👤 الاسم ⟫ ${userName}
┇ 🌟 تمت الترقية إلى مشرف
┇ 🎊 مبروك على المنصب!
●━━━━━━━━━━━━━━━━━━━━━●`;
                    } else if (adminAction === "remove_admin") {
                        adminMsg =
`‎
●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🔻 إزالة أدمـن ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 👤 الاسم ⟫ ${userName}
┇ 🔻 تمت إزالته/ها من الإشراف
●━━━━━━━━━━━━━━━━━━━━━●`;
                    }
                    if (adminMsg) api.sendMessage(adminMsg, threadID);
                } catch (e) {
                    api.sendMessage(
`●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 🛡️ إشعار الأدمن ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 🔄 تم تحديث قائمة المشرفين
●━━━━━━━━━━━━━━━━━━━━━●`, threadID);
                }
                break;
            }
        }
    } catch (error) {
        console.error("خطأ في معالجة الحدث:", error.message);
    }
};

module.exports.HakimRun = async function ({ api, event }) {
    api.sendMessage(
`●━━━━━━━━━━━━━━━━━━━━━●
 ⦿ ⟬ 📡 إشعار الأحداث ⟭ ⦿
●━━━━━━━━━━━━━━━━━━━━━●
┇ 🤖 هذا الأمر يعمل تلقائياً
┇ ✅ مع أحداث المجموعة
●━━━━━━━━━━━━━━━━━━━━━●`,
        event.threadID, event.messageID);
};

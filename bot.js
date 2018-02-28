const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const data = require("./data.json");
var list = ["help", "gimme cookie"];

client.on("ready", () => {
  console.log("I'm ready! I'm ready!");
});

var active = [];

client.on("message", msg => {
  try  {
  if (client.user.username === msg.author.username) return;
  if (!msg.guild.channels) return;

  if (msg.content.toLowerCase() === "cookie") {
  msg.delete();
  if (!msg.guild.roles.some(r=>data.permitted.includes(r.name))) return msg.reply("You don't have access to CookieBot");
  for (i=0;i<active.length;i++) {
    if (active[i].split("$")[0] === msg.author.username) return msg.reply("You've already gotten my attention, " + msg.author.username);
  }
  active.push(msg.author.username + "$0");
  var temploop = setInterval(() => {
    for (i=0;i<active.length;i++) {
      var count = parseInt(active[i].split("$")[1]);
      count++;
      if (count > 30) {
      active.splice(i, 1);
      clearInterval(temploop);
      return;
      }
      var name = active[i].split("$")[0];
      active[i] = name + "$" + count;
    }
  }, 1000);
  return;
}
for (i=0;i<active.length;i++) {
  if (msg.guild.roles.some(r=>data.permitted.includes(r.name))) {
  if (active[i].split("$")[0] === msg.author.username) {
    active.splice(i,1);
    msg.delete();
    var ms = msg.content;
    if (ms.toLowerCase() === "gimme cookie") return msg.reply("\:cookie:");
    if (ms.toLowerCase() === "help") return msg.reply("Here is a list\n" + list.join("\n"));
    if (ms.toLowerCase() === "clear") return msg.channel.bulkDelete(100).catch(() => {
      msg.reply("Can not clear");
    });
    if (ms.toLowerCase().startsWith("ban")) {
      var amount = parseInt(ms.split(" ")[2]);
      if (amount < 0 || amount > 7 || !amount) return msg.reply("Please enter a valid number above 0 and under 7");
      if (!msg.mentions.members) return msg.reply("Please mention someone!");
      var member = msg.mentions.members.first();
      member.ban(amount).then(member => {
        msg.channel.send(msg.author.username + " has successfully banned " + member.displayName + " for " + amount + " days");
      }).catch((e, member) => {
      msg.reply("Could not ban " + member.displayName + " : " + e.message);
      });
      return;
    }



    if (ms.toLowerCase().startsWith("kick")) {
      if (!msg.mentions.members) return msg.reply("Please mention someone!");
      var member = msg.mentions.members.first();
      member.kick().then(member => {
        msg.channel.send(msg.author.username + " has successfully kicked " + member.displayName);
      }).catch((e, member) => {
      msg.reply("Could not kick " + member.displayName + " : " + e.message);
      });
      return;
    }
    if (ms.toLowerCase().startsWith("mute")) {
      if (!msg.mentions.members) return msg.reply("Please mention someone!");
      var member = msg.mentions.members.first();
      if (!msg.guild.roles.find("name", "muted")) {
        var muted = msg.guild.createRole({
    data: {
        name: "muted",
        permissions: []
    }
});
setTimeout(() => {
msg.guild.channels.forEach(async (channel, id) => {
  await channel.overwritePermission(muted, {
    SEND_MESSAGES: false,
    ADD_REACTIONS: false
  });
});
member.addRole(msg.guild.roles.find("name", "muted"));
return;
}, 1000);
      }
        member.addRole(msg.guild.roles.find("name", "muted"));
      return;
    }
    if (ms.toLowerCase().startsWith("unmute")) {
      if (!msg.mentions.members) return msg.reply("Please mention someone!");
      var member = msg.mentions.members.first();
      if (!msg.guild.roles.some(r=>("muted").includes(r.name))) return msg.reply("This user is not muted");
      member.removeRole(msg.guild.roles.find("name", "muted").id);
      return;
    }
    return msg.reply("That is an unknown command!");
  }
}
return;
}
} catch (e) {
  msg.channel.send("ERROR: " + e.message);
}
});

client.login(config.token);

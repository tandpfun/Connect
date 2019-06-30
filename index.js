/*
* Connect Social Bot
* Copyright 2019 @Codingpro#0001
*/

/* Discord.js */
const Discord = require('discord.js')
let client = new Discord.Client()

/* Canvas */
const Canvas = require('canvas');

/* FileSync */
const fs = require("fs")

/* Load Data Files */
let profiles = JSON.parse(fs.readFileSync("profiles.json"));
let datafile = JSON.parse(fs.readFileSync("data.json"));

/* Setup Express */
var express = require('express');
var app = express();

var port = 3000
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(port, () => console.log("Server Online!"))

/* Connect discord.js to bot user */
client.login(process.env.TOKEN).catch(console.error);

/* When bot user is ready: */
client.on('ready', function (evt, callback) {
 client.user.setUsername("Connect"); // Set Bot Username
 console.log(client.user.tag + " online in " + client.guilds.size + " guilds!"); // Log Bot Startup

 /* Set Bot Status */
 client.user.setPresence({
   game: {
     type: 0, // Set to 'playing'
     name: `+help | ConnectBot Beta | ${client.guilds.size} servers!` // Set what the bot is 'playing'
   },
   status: "online" // Set bot to online status
 });
});


/* Functions */
var functions = {
  sti: (string) => {
    return string.replace(/[^0-9]/g, "");
  }
}

/* Command Cooldowns */
let workcooldown = new Set();
let crimecooldown = new Set();
let fishcooldown = new Set();

/* All The Bot's Commands */
var commands = {
 help: {
   usage: "help",
   description: "Learn how the bot works!",
   category: "profile",
   aliases:["cmds","commands"],
   run: (message) => {
     let embed = new Discord.RichEmbed()
     embed.setAuthor("ConnectBot Commands", client.user.avatarURL)
     embed.addField("📇 **Profile Commands**","`+setup` - Setup your profile\n`+profile` - View your profile\n`+get (user)` - Get another user's profile\n`+edit` - Edit your profile")
     embed.addField("💵 **Get Experience**", "`+work` - Gain from 1xp to 300xp every 10 minutes\n`+gamble (xp)` - 1/2 chance of doubling xp\n`+crime` - 1/5 chance of getting up to 1200xp. Or loosing it.\n`+fish` - Go fishing, and try to sell the fish for more than you pay for casting!\n`Every Message` - Gain 10xp for every message every 30 seconds")
     embed.addField("🛒 **Buy Stuff**","`+shop` - Buy something from the shop.")
     embed.setColor("GREEN")
     embed.setFooter("Connect Soical Bot")
     message.channel.send(embed)
   }
 },
 shop: {
   usage: "shop",
   description: "Buy something for xps!",
   category: "shop",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     let embed = new Discord.RichEmbed()
     embed.setAuthor("XP Shop","https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png")
     embed.setTitle("Send the item you want to buy's ID to this channel:")
     embed.addField(":one: Custom Profile Text Color","Cost: 1000xp")
     embed.addField(":two: Turt Badge On Profile","Cost: 2500xp")
     embed.addField(":three: MLG Profile Background","Cost: 3500xp")
     embed.addField(":four: Rainbow Profile Background","Cost: 5000xp")
     embed.addField(":five: Rich Icon On Profile","Cost: 10000xp")
     embed.setColor("GREEN")
     embed.setFooter("To cancel, say anything else.")
     message.channel.send(embed)
     let filter = (m) => m.author.id === message.author.id;
     let collector = message.channel.createMessageCollector(filter, { time: 60000 });
     collector.on('collect', m => {
        if (m.content==="1") {
          collector.stop()
          if (datafile.xp[message.author.id]<1000) return message.channel.send("<:warning:579387552453099561> **Whoops!** You don't have enough money to buy this.")
          message.channel.send("<:Info:536983515292499968> Please send the hex color including the # to this channel. To cancel, type `cancel`.")
          let collector2 = message.channel.createMessageCollector(filter);
          collector2.on('collect', msg => {
            if (msg.content==="cancel") {
              message.channel.send("<:GreenTick:449951413913780255> **Cancelled. You have not been charged.**")
              collector2.stop()
            } else if (msg.content.startsWith('#')) {
              datafile.xp[message.author.id]=datafile.xp[message.author.id]-1000
              profiles.color[message.author.id]=msg.content
              fs.writeFileSync("data.json", JSON.stringify(datafile));
              fs.writeFileSync("profiles.json", JSON.stringify(profiles));
              commands["profile"].run(message)
              collector2.stop()
            } else {
              collector2.stop()
              message.channel.send("<:warning:579387552453099561> **Whoops!** Something went wrong. Please try again.")
            }
          })
        } else if (m.content==="2") {
          collector.stop()
          if (datafile.xp[message.author.id]<2500) return message.channel.send("<:warning:579387552453099561> **Whoops!** You don't have enough money to buy this.")
          if (profiles.badges[message.author.id].includes("turt")) return message.channel.send("<:warning:579387552453099561> **Whoops!** You already have this badge")
          profiles.badges[message.author.id].push("turt")
          datafile.xp[message.author.id]=datafile.xp[message.author.id]-2500
          fs.writeFileSync("profiles.json", JSON.stringify(profiles));
          fs.writeFileSync("data.json", JSON.stringify(datafile));
          commands["profile"].run(message)
        } else if (m.content==="3") {
          collector.stop()
          if (datafile.xp[message.author.id]<3500) return message.channel.send("<:warning:579387552453099561> **Whoops!** You don't have enough money to buy this.")
          profiles.background[message.author.id]="https://vignette.wikia.nocookie.net/youtube/images/c/c8/Euphoric%2B_447d95e276a5b1dd56cac5e4a5d82b6c.jpg/revision/latest?cb=20150316195509"
          datafile.xp[message.author.id]=datafile.xp[message.author.id]-3500
          fs.writeFileSync("profiles.json", JSON.stringify(profiles));
          fs.writeFileSync("data.json", JSON.stringify(datafile));
          commands["profile"].run(message)
        } else if (m.content==="4") {
          collector.stop()
          if (datafile.xp[message.author.id]<5000) return message.channel.send("<:warning:579387552453099561> **Whoops!** You don't have enough money to buy this.")
          profiles.background[message.author.id]="https://rockymountainflag.com/wp-content/uploads/2017/03/lgbt.jpg"
          datafile.xp[message.author.id]=datafile.xp[message.author.id]-5000
          fs.writeFileSync("profiles.json", JSON.stringify(profiles));
          fs.writeFileSync("data.json", JSON.stringify(datafile));
          commands["profile"].run(message)
        } else if (m.content==="5") {
          collector.stop()
          if (datafile.xp[message.author.id]<10000) return message.channel.send("<:warning:579387552453099561> **Whoops!** You don't have enough money to buy this.")
          if (profiles.badges[message.author.id].includes("rich")) return message.channel.send("<:warning:579387552453099561> **Whoops!** You already have this badge")
          profiles.badges[message.author.id].push("rich")
          datafile.xp[message.author.id]=datafile.xp[message.author.id]-10000
          fs.writeFileSync("profiles.json", JSON.stringify(profiles));
          fs.writeFileSync("data.json", JSON.stringify(datafile));
          commands["profile"].run(message)
        } else {
          message.channel.send("<:warning:579387552453099561> **Whoops!** You need to say a number from 1-5. Please try again. You have not lost any experience.")
          collector.stop()
        }
     })
   }
 },
 fish: {
   usage: "fish",
   description: "Fish for some xp!",
   category: "gain",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     if (!fishcooldown.has(message.author.id)) {
       let catches = ["🦀","🐟","🐠","🐡"]
       let sell = Math.floor(Math.random()*30)
       let change = sell-15
       message.channel.send("<a:loading:588180824227184652> You cast your line!")
       setTimeout(()=>{
         let fish = catches[Math.floor(Math.random()*catches.length)];
         message.channel.send("🎣 You caught a " + fish + "! You payed 15xp for casting.")
         datafile.xp[message.author.id]=datafile.xp[message.author.id]+change
         message.channel.send("💰 You sold " + fish + " for " + sell + "xp!")
         fs.writeFileSync("data.json", JSON.stringify(datafile));
       }, 3000)
       fishcooldown.add(message.author.id);
        setTimeout(() => {
          fishcooldown.delete(message.author.id);
        }, 10000);
     } else {
       message.channel.send("Please wait 10 seconds before fishing again!")
     }
   }
 },
 crime: {
   usage: "crime",
   description: "Commit a crime",
   category: "gain",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     let crimes = ["rob a bank", "steal a bread loaf", "find money on the ground", "hack discord", "steal a carpet","steal your friend's chair","dab","hit the whip"]
     if (!crimecooldown.has(message.author.id)) {
       let crime = crimes[Math.floor(Math.random()*crimes.length)];
       let money = Math.floor(Math.random()*1200)
       let odds = Math.floor(Math.random()*3)
       if (odds === 1) {
         datafile.xp[message.author.id]=datafile.xp[message.author.id]+money
         fs.writeFileSync("data.json", JSON.stringify(datafile));
         const canvas = Canvas.createCanvas(700, 250);
         const ctx = canvas.getContext('2d');
         Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((icon) => {
             ctx.drawImage(icon, 20, 50, 150, 150);
             ctx.font = '30px sans-serif';
             ctx.fillStyle = '#FFD700';
             ctx.fillText(`You ${crime}\nand earn ${money}xp! Good Job!`, 175, 100);
             const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
             message.channel.send(attachment);
         })
       } else {
         datafile.xp[message.author.id]=datafile.xp[message.author.id]-money
         fs.writeFileSync("data.json", JSON.stringify(datafile));
         const canvas = Canvas.createCanvas(700, 250);
         const ctx = canvas.getContext('2d');
         Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((icon) => {
             ctx.drawImage(icon, 20, 50, 150, 150);
             ctx.font = '30px sans-serif';
             ctx.fillStyle = '#f96854';
             ctx.fillText(`You tried to\n${crime}\nand failed. You lost ${money}xp.`, 175, 100);
             const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
             message.channel.send(attachment);
         })
       }
       crimecooldown.add(message.author.id);
        setTimeout(() => {
          crimecooldown.delete(message.author.id);
        }, 600000);
     } else {
       message.channel.send("You can only commit a crime every 10 minutes!")
     }
   }
 },
 gamble: {
   usage: "gamble (amount of xps)",
   description: "Gamble ur xps",
   category: "gain",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     let args = parseInt(message.content.substring(8),10)
     if (!args || args==="") return message.channel.send("<:warning:579387552453099561> **Whoops!** Please include how much money to gamble.")
     if(args>datafile.xp[message.author.id]) return message.channel.send("<:warning:579387552453099561> **Whoops!** You can't gamble more than you have! You have " + datafile.xp[message.author.id] + "xp and tried to gamble " + args + "xp!")
     if(args<0) return message.channel.send("<:warning:579387552453099561> **Whoops!** You can't gamble less than 0!")
     let odds = Math.floor(Math.random()*2)
     if (odds===1) {
       datafile.xp[message.author.id]=Math.floor(datafile.xp[message.author.id]+args)
       fs.writeFileSync("data.json", JSON.stringify(datafile));
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage('https://cdn0.iconfinder.com/data/icons/sport-achievment-badges/128/sport_badges-02-512.png').then((icon) => {
           ctx.drawImage(icon, 20, 50, 150, 150);
           ctx.font = '50px sans-serif';
           ctx.fillStyle = '#FFD700';
           ctx.fillText(`You Won! +${args}xp!`, 175, 135);
           const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
           message.channel.send(attachment);
       })
     } else {
       datafile.xp[message.author.id]=Math.floor(datafile.xp[message.author.id]-args)
       fs.writeFileSync("data.json", JSON.stringify(datafile));
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage('https://cdn.glitch.com/85f76f83-44e1-4054-be57-0c6655e1314e%2Fx-button.png?v=1561648644518').then((icon) => {
           ctx.drawImage(icon, 20, 50, 150, 150);
           ctx.font = '50px sans-serif';
           ctx.fillStyle = '#f96854';
           ctx.fillText(`You Lost! -${args}xp!`, 175, 135);
           const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
           message.channel.send(attachment);
       })
     }
   }
 },
 work: {
   usage: "work",
   description: "Work for some XPS!",
   category: "gain",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     let jobs = ["Discord Bot Coder","Discord Employee","Youtuber With 1 Subscriber","Bathroom Cleaner","Meter Maid","Hamburgaler","Trash Diver","Wumpus Petter","Emoji Maker","Instagram Follower","Minecraft Server Owner","Dog Groomer","TV","Bad Product Designer"]
     if (!workcooldown.has(message.author.id)) {
       let job = jobs[Math.floor(Math.random()*jobs.length)];
       let money = Math.floor(Math.random()*300)
       datafile.xp[message.author.id]=datafile.xp[message.author.id]+money
       fs.writeFileSync("data.json", JSON.stringify(datafile));
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((icon) => {
           ctx.drawImage(icon, 20, 50, 150, 150);
           ctx.font = '30px sans-serif';
           ctx.fillStyle = '#ffffff';
           ctx.fillText(`You work as a\n${job}\nand earn ${money}xp! Good Job!`, 175, 100);
           const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
           message.channel.send(attachment);
       })
       workcooldown.add(message.author.id);
        setTimeout(() => {
          workcooldown.delete(message.author.id);
        }, 600000);
     } else {
       message.channel.send("You can only work every 10 minutes!")
     }
   }
 },
 edit: {
   usage: "edit",
   description: "Edit your profile",
   category: "profile",
   aliases:[],
   run: (message) => {
     if (!profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** Please create your profile first: `+setup`")
     if (!message.content.startsWith("+edit desc") && !message.content.startsWith("+edit back")) {
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage('https://convertingcolors.com/plain-2C2F33.svg').then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
         Canvas.loadImage('https://cdn3.iconfinder.com/data/icons/flat-circle-content/512/circle-edit-line-2-512.png').then((icon) => {
               ctx.drawImage(icon, 20, 50, 150, 150);
               ctx.font = '30px sans-serif';
               ctx.fillStyle = '#ffffff';
               ctx.fillText(`+edit desc - edit your description\n\n+edit back - edit your background`, 175, 100);
               const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
               message.channel.send(attachment);
           })
       })
     } else if (message.content.startsWith("+edit desc")) {
       const filter = (m) => m.author.id === message.author.id;
       message.channel.send("📝 Send your desired description to this channel!")
       const collector = message.channel.createMessageCollector(filter);
       collector.on('collect', m => {
         profiles.description[message.author.id]=m.content
         fs.writeFileSync("profiles.json", JSON.stringify(profiles));
         commands["profile"].run(message)
         collector.stop()
       });
       collector.on('end', collected => console.log(`Collected ${collected.size} items`));
     } else if (message.content.startsWith('+edit back')) {
       let attachment = new Discord.Attachment('choosebackground.png', 'profile.png');
       message.channel.send('📝 Send your desired background\'s number to this channel!', attachment);
       const filter = (m) => m.author.id === message.author.id;
       const collector = message.channel.createMessageCollector(filter);
       collector.on('collect', m => {
         let backgrounds = ["1","2","3","4"]
         if (!backgrounds.includes(m.content)) {
           message.channel.send("Cancelled: Please say a number from 1 to 4.")
           collector.stop()
         } else {
           let backlinks = {"1":"https://convertingcolors.com/plain-2C2F33.svg","2":"https://colorswatches.info/7289da.png","3":"https://i2.wp.com/onlyvectorbackgrounds.com/wp-content/uploads/2018/10/Abstract-Geometric-Background-Green.jpg?fit=1191%2C842","4":"https://cdn.glitch.com/85f76f83-44e1-4054-be57-0c6655e1314e%2FUntitled.png?v=1561568852068"}
           profiles.background[message.author.id]=backlinks[m.content]
           fs.writeFileSync("profiles.json", JSON.stringify(profiles));
           commands["profile"].run(message)
           collector.stop()
         }
       });
       collector.on('end', collected => console.log(`Collected ${collected.size} items`));
     }
   }
 },
 setup: {
   usage: "setup",
   description: "Setup your profile",
   category: "profile",
   aliases:[],
   run: (message) => {
     if (profiles.profiles.includes(message.author.id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** You already have a profile!")
     message.channel.send("**<:connect:593211341808861204> Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       profiles.background[message.author.id] = "https://convertingcolors.com/plain-2C2F33.svg"
       profiles.description[message.author.id] = 'No Description Set'
       profiles.color[message.author.id] = "#ffffff"
       profiles.profiles.push(message.author.id)
       profiles.badges[message.author.id]=[]
       datafile.xp[message.author.id]=0
       fs.writeFileSync("profiles.json", JSON.stringify(profiles));
       fs.writeFileSync("data.json", JSON.stringify(datafile));
       setTimeout(()=>{
         msg.edit("<a:acheck:587844986868072458> **Your profile has been added.** View all commands with `+help`.")
         commands["profile"].run(message)
       },1500)
     })
   }
 },
 get: {
   usage: "get (user)",
   description: "View someone else's profile",
   category: "profile",
   aliases:[],
   run: (message) => {
     let id = functions.sti(message.content.substring(5))
     if (!profiles.profiles.includes(id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** I could not find that user. Make sure they have setup a profile!")
     if (!client.users.find("id", id)) return message.channel.send("<:warning:579387552453099561> **Whoops!** I could not find that user. Make sure they have setup a profile!")
     let user = client.users.find("id", id)
     const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(profiles.background[id]).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user.avatarURL).then((icon) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                 Canvas.loadImage('https://cdn.discordapp.com/emojis/593843383991271425.png').then((turt) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                      let leaderboard = datafile.xp
                      const ordered = {};
                      Object.keys(leaderboard).sort().forEach(function(key) {
                         ordered[key] = leaderboard[key];
                      });
                      ctx.drawImage(xp, 225, 90, 50, 50);
                      ctx.drawImage(lb, 40, 205, 30, 30);
                      if (profiles.badges[id].includes("turt")) {
                        ctx.drawImage(turt, 250, 147, 55, 40);
                      }
                      if (profiles.badges[id].includes("rich")) {
                        ctx.drawImage(rich, 320, 147, 40, 40);
                      }
                      ctx.font = '40px sans-serif';
                      ctx.fillStyle = profiles.color[id];
                      ctx.fillText(`${user.tag}`, 240, 90);
                      ctx.font = '25px sans-serif';
                      ctx.fillText(`${datafile.xp[id]}xp`, 270, 128);
                      ctx.fillText(`Bio: ${profiles.description[id]}`, 77, 229);
                      ctx.beginPath();
                    	ctx.arc(105, 120, 75, 0, Math.PI * 2, true);
                    	ctx.closePath();
                    	ctx.clip();
                      ctx.drawImage(icon, 30, 45, 150, 150);
                      const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
                      message.channel.send(`Here is ${user.tag}'s profile!`, attachment);
                   })
                 })
               })
             })
           })
       })
   }
 },
 profile: {
   usage: "profile",
   description: "View your own profile.",
   category: "profile",
   aliases:["bal","xp","balance","money"],
   run: (message) => {
     if(profiles.profiles.includes(message.author.id)) {
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(profiles.background[message.author.id]).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(message.author.avatarURL).then((icon) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                 Canvas.loadImage('https://cdn.discordapp.com/emojis/593843383991271425.png').then((turt) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                      let leaderboard = datafile.xp
                      const ordered = {};
                      Object.keys(leaderboard).sort().forEach(function(key) {
                         ordered[key] = leaderboard[key];
                      });
                      ctx.drawImage(xp, 225, 90, 50, 50);
                      ctx.drawImage(lb, 40, 205, 30, 30);
                      if (profiles.badges[message.author.id].includes("turt")) {
                        ctx.drawImage(turt, 250, 147, 55, 40);
                      }
                      if (profiles.badges[message.author.id].includes("rich")) {
                        ctx.drawImage(rich, 320, 147, 40, 40);
                      }
                      ctx.font = '40px sans-serif';
                      ctx.fillStyle = profiles.color[message.author.id];
                      ctx.fillText(`${message.author.tag}`, 240, 90);
                      ctx.font = '25px sans-serif';
                      ctx.fillText(`${datafile.xp[message.author.id]}xp`, 270, 128);
                      ctx.fillText(`Bio: ${profiles.description[message.author.id]}`, 77, 229);
                      ctx.beginPath();
                    	ctx.arc(105, 120, 75, 0, Math.PI * 2, true);
                    	ctx.closePath();
                    	ctx.clip();
                      ctx.drawImage(icon, 30, 45, 150, 150);
                      const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
                      message.channel.send(`Here is your profile, ${message.author.tag}!`, attachment);
                   })
                 })
               })
             })
           })
       })
     } else {
       const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage('https://convertingcolors.com/plain-2C2F33.svg').then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
         Canvas.loadImage('https://yokoent.com/images/warning-png-icon-3.png').then((icon) => {
               ctx.drawImage(icon, 20, 50, 150, 150);
               ctx.font = '40px sans-serif';
               ctx.fillStyle = '#ffffff';
               ctx.fillText(`You don't have a profile!\nRun +setup`, 190, 110);
               const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
               message.channel.send(attachment);
           })
       })
     }
   }
 },
}
const cooldown = new Set();
client.on("message", async (message) => {
 if(message.author.bot) return;
  if (profiles.profiles.includes(message.author.id)) {
    if (!cooldown.has(message.author.id)) {
    datafile.xp[message.author.id]=datafile.xp[message.author.id]+10
    fs.writeFileSync("data.json", JSON.stringify(datafile));
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 30000);
  }
  }
 if(message.content.toLowerCase().startsWith("+")) {
   for(let i in commands) {
     if(message.content.toLowerCase().split(" ")[0].slice(1) === i || commands[i].aliases.includes(message.content.toLowerCase().split(" ")[0].slice(1))) {
       commands[i].run(message)
       console.log(`${message.author.tag} used the ${commands[i].usage} command in ${message.guild.name}`)
     }
   }
 }
})

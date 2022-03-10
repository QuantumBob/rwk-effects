// const MT = {};
// MT.isTemplatedEffect = false;
// MT.template = null;
// MT.predefinedSpells = {
//     "Fireball": {
//         "angle": "360",
//         "hex": "#000000"
//     },
//     "Light": {
//         "angle": "360",
//         "hex": "#FFBF00"
//     },
//     "Cone of Cold": {
//         "angle": "53",
//         "hex": "#6495ed"
//     }
// };

// export const isFoundry8or9 = () => {
//     const foundryVersion = game.version;
//     return foundryVersion >= '0.8.0';
// }

// ASCII Artwork
// const ASCII = `    __________________________
//     _____  __        ____   _
//     |  _ \\ | ]       | | ] / ]
//     | | \\ \\| |       | | |/ /
//     | |__) ) }  /\\   ] ] / /
//     |  _  /\\ \\_/  \\_/ /| | \\
//     | | \\ \\ \\   /\\   / | |\\ \\
//     |_|  \\_] \\_/  \\_/  |_| \\_]
//     __________________________
//     `;

// Hooks.on("init", () => {

//     console.log(`RWK Effects | Initializing the RWK ATL effects addon\n${ASCII}`);

    // if (game.system.data.name !== "dnd5e") {
    //     console.error(`RWK Effects | This module needs DnD5e`);
    //     return;
    // }

// });

// Hooks.on("ready", () => {

//     if (game.system.data.name !== "dnd5e") {
//         ui.notifications.info("RWK Effects needs DnD5e");
//         return;
//     }
// });

// Hooks.on("collapseSidebarPre", async (sidebar, collapse) => {
//     ui.notifications.info("Stop");
// });


// Hooks.on("preUpdateActiveEffect", async (effect, change, options, id) => {

//     // only check for change in disabled status
//     if (typeof change.disabled === 'undefined' || change.disabled === false)
//         return;
//     // make sure effect is on an actor not an item
//     if (!effect.parent || !(effect.parent instanceof CONFIG.Actor.documentClass))
//         return true;
//     // check if the effect has a macro
//     for (let change of effect.data.changes) {
//         if (change.key.includes("macro.execute")) {
//             // delete all token magic filters
//             // TODO expand to check other actors in the scene. ie if a spell was cast on someone else
//             // game.macros.getName("00 - A - Delete filters on Selected").execute();
//         }
//     }
// });

// Hooks.on("preUpdateItem", async (item, change) => {

//     if (typeof change.data === 'undefined')
//         return;

//     const ids = [];
//     switch (item.type) {
//         case "spell":
//             break;

//         case "consumable":
//             // only check for change in equipped status
//             if (typeof change.data.equipped !== 'undefined' && change.data.equipped === false) {
//                 // loop through actors effects
//                 for (const actorEffect of item.actor.effects) {
//                     // check if the effect origin includes the item id
//                     if (actorEffect.data.origin.includes(item.id)) {
//                         // put ids of found actor effects into array
//                         ids.push(actorEffect.id);
//                     }
//                 }
//                 // don't update if array is empty
//                 if (ids.length > 0) {
//                     await item.actor.deleteEmbeddedDocuments("ActiveEffect", ids);
//                 }
//             }
//             break;
//     }
// });

// Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
//     addStopSpellButtonListener(app, html, data);
// });

// function addStopSpellButtonListener(app, html, data, triggeringElement = "", buttonContainer = "") {
//     // Setting default element selectors
//     let alreadyExpandedElement;
//     if (triggeringElement === "")
//         triggeringElement = ".item .item-name";
//     if (["BetterNPCActor5eSheet", "BetterNPCActor5eSheetDark"].includes(app.constructor.name)) {
//         triggeringElement = ".item .npc-item-name";
//         buttonContainer = ".item-properties";
//         alreadyExpandedElement = ".item.expanded .npc-item-name"; //CHANGE
//     }
//     if (buttonContainer === "")
//         buttonContainer = ".item-properties";
//     // adding an event for when the description is shown
//     html.find(triggeringElement).click(event => {
//         addStopSpellButton(event.currentTarget, app, html, data, buttonContainer);
//     });
//     if (alreadyExpandedElement) {
//         html.find(alreadyExpandedElement).get().forEach(el => {
//             addStopSpellButton(el, app, html, data, buttonContainer);
//         });
//     }
// }

// function addStopSpellButton(target, app, html, data, buttonContainer) {
//     let li = $(target).parents(".item");
//     if (!li.hasClass("expanded"))
//         return;
//     let item = app.object.items.get(li.attr("data-item-id"));
//     if (!item)
//         return;
//     let targetHTML = $(target.parentNode.parentNode);
//     let buttonTarget = targetHTML.find(".item-buttons");
//     let buttonsWereAdded = false;
//     // Create the button
//     switch (item.data.type) {
//         case "spell":
//             buttonTarget.find(".tag:last").after(`<span class="tag"><button data-action="stopSpell" data-item="${item.id}" data-parent="${item.parent.id}">Stop Spell</button></span>`);
//             break;
//     }
//     buttonsWereAdded = true;
//     if (buttonsWereAdded) {
//         // adding the buttons to the sheet
//         targetHTML.find(buttonContainer).prepend(buttonTarget);
//         buttonTarget.find("button").click({ app, data, html }, async (ev) => {
//             ev.preventDefault();
//             ev.stopPropagation();
//             let event = { shiftKey: ev.shiftKey == true, ctrlKey: ev.ctrlKey === true, metaKey: ev.metaKey === true, altKey: ev.altKey === true };

//             switch (ev.target.dataset.action) {
//                 case "stopSpell":
//                     await stopSpell({ event, item: ev.target.dataset.item, parent: ev.target.dataset.parent, versatile: false, resetAdvantage: true });
//             }
//         });
//     }
// }

// async function stopSpell(data) {

//     const actor = game.actors.get(data.parent);
//     const item = actor.items.get(data.item);
//     if (!actor || !(actor instanceof CONFIG.Actor.documentClass))
//         return true;

//     const updates = [];
//     for (const itemEffect of item.effects) {

//         const actorEffect = actor.effects.find(ae => ae.data.label == itemEffect.data.label);
//         if (actorEffect) {

//             for (let change of actorEffect.data.changes) {

//                 if (change.key.includes("macro.execute")) {
//                     const macro = game.macros.getName("00 - A - Delete filters on Selected").execute();
//                 }
//             };
//             if (actorEffect)
//                 updates.push({ _id: actorEffect.id, disabled: true });
//         }
//     }
//     if (updates.length > 0) {
//         await actor.updateEmbeddedDocuments("ActiveEffect", updates);
//     }
// }


// Hooks.on("createMeasuredTemplate", async (template) => {

//     if (MT.isTemplatedEffect) {

//         const lightData = [{
//             t: "l", // l for local. The other option is g for global.
//             x: template.data.x, // horizontal positioning
//             y: template.data.y, // vertical positioning
//             rotation: template.data.direction - 90, // the beam direction of the light in degrees (if its angle is less than 360 degrees.)
//             config: {
//                 dim: template.data.distance, // the total radius of the light, including where it is dim.
//                 bright: template.data.distance * 0.9, // the bright radius of the light
//                 angle: MT.predefinedSpells[MT.template].angle, // the coverage of the light. (Try 30 for a "spotlight" effect.)

//                 // Oddly, degrees are counted from the 6 o'clock position.
//                 color: MT.predefinedSpells[MT.template].hex, // Light coloring.
//                 alpha: 1
//             } // Light opacity (or "brightness," depending on how you think about it.)
//         }];

//         if (game.user.isGM) {
//             const light = await template.parent.createEmbeddedDocuments("AmbientLight", lightData);

//             const key = "flags.rwk-effects." + template.id;
//             const updateData = {
//                 [key]: light[0].id,
//             };
//             template.update(updateData);
//             MT.isTemplatedEffect = false;
//         }
//     }
// });

// Hooks.on("deleteMeasuredTemplate", async (template) => {

//     if (game.user.isGM) {
//         const lightID = template.getFlag('rwk-effects', template.id);

//         if (typeof lightID !== 'undefined') {
//             const light = template.parent.getEmbeddedDocument("AmbientLight", lightID);

//             template.parent.deleteEmbeddedDocuments("AmbientLight", [lightID]);
//         }
//     }
// });

// Hooks.on("createChatMessage", async (chatMessage) => {

//     if (chatMessage.data.flavor in MT.predefinedSpells) {
//         MT.isTemplatedEffect = true;
//         MT.template = chatMessage.data.flavor;
//     }

//     const actor = game.actors.get(chatMessage.data.speaker.actor);
//     const item = actor?.items.getName(chatMessage.data.flavor);

//     // only check for items with effects
//     if (typeof item === 'undefined')
//         return;

//     const updates = [];

//     // switch (item.type) {
//     // case "spell":
//     //     const parent = item.parent;
//     //     if (!parent || !(parent instanceof CONFIG.Actor.documentClass))
//     //         return true;

//     //     for (const itemEffect of item.effects) {

//     //         const actorEffect = actor.effects.find(ae => ae.data.label == itemEffect.data.label);
//     //         if (actorEffect) {

//     //             for (let change of actorEffect.data.changes) {

//     //                 if (change.key.includes("macro.execute")) {
//     //                     const macro = game.macros.getName(change.value).execute();
//     //                 }
//     //             };
//     //             if (actorEffect)
//     //                 updates.push({ _id: actorEffect.id, disabled: false });
//     //         }
//     //     }
//     //     if (updates.length > 0) {
//     //         await actor.updateEmbeddedDocuments("ActiveEffect", updates);
//     //     }
//     //     break;
//     // case "consumable":
//     // item.effects.forEach(itemEffect => {
//     for (const itemEffect of item.effects) {
//         // find effect on actor with same name as on item
//         // for non transfer ae push the items effect to the actor
//         // const actorEffect = actor.effects.find(ae => ae.data.label == itemEffect.data.label);
//         const newAE = await itemEffect.clone();
//         newAE.data.origin = "Item." + item.id;
//         newAE.data._source.origin = "Item." + item.id;
//         updates.push(newAE.data);//{ _id: actorEffect.id, disabled: false });
//     }//);
//     // if the item is not equipped set it to euipped
//     if (!getProperty(item.data, "data.equipped")) {
//         await item.update({ ["data.equipped"]: true });
//     }
//     // don't update if array is empty
//     if (updates.length > 0) {
//         // await actor.updateEmbeddedDocuments("ActiveEffect", updates);
//         let user = game.users.get(chatMessage.data.user);
//         let targets = user.targets;
//         await actor.createEmbeddedDocuments("ActiveEffect", updates, { keepEmbeddedIds: true });
//     }
    //         break;
    //     default:
    //         break;
    // }
// });


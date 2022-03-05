const MT = {};
MT.isTemplatedEffect = false;
MT.template = null;
MT.predefinedSpells = {
    "Fireball": {
        "angle": "360",
        "hex": "#000000"
    },
    "Light": {
        "angle": "360",
        "hex": "#FFBF00"
    },
    "Cone of Cold": {
        "angle": "53",
        "hex": "#6495ed"
    }
};

// ASCII Artwork
const ASCII = `    __________________________
    _____  __        ____   _
    |  _ \\ | ]       | | ] / ]
    | | \\ \\| |       | | |/ /
    | |__) ) }  /\\   ] ] / /
    |  _  /\\ \\_/  \\_/ /| | \\
    | | \\ \\ \\   /\\   / | |\\ \\
    |_|  \\_] \\_/  \\_/  |_| \\_]
    __________________________
    `;

Hooks.on("init", () => {

    console.log(`RWK Effects | Initializing the RWK ATL effects addon\n${ASCII}`);

    if (game.system.data.name !== "dnd5e") {
        console.error(`RWK Effects | This module needs DnD5e`);
        return;
    }
});

Hooks.on("ready", () => {

    if (game.system.data.name !== "dnd5e") {
        ui.notifications.info("RWK Effects needs DnD5e");
        return;
    }
    ui.notifications.info("RWK Effects is great");

    Hooks.on("preUpdateItem", async (item, change) => {

        if (typeof change.data === 'undefined') return;
        const updates = [];
        // only check for change in equipped status
        if (typeof change.data.equipped !== 'undefined') {
            // only check for items with effects
            item.actor.effects.forEach(effect => {
                // check if the effect origin is the item
                if (effect.data.origin.includes(item.id)) {
                    // disable effect if the item it is on is unequipped
                    if (!change.data.equipped) {
                        updates.push({ _id: effect.id, disabled: true });
                    }
                }
            });
            // don't update if array is empty
            if (updates.length > 0) {
                await item.actor.updateEmbeddedDocuments("ActiveEffect", updates);
            }
        }
    });

    Hooks.on("createMeasuredTemplate", async (template) => {

        if (MT.isTemplatedEffect) {

            const lightData = [{
                t: "l", // l for local. The other option is g for global.
                x: template.data.x, // horizontal positioning
                y: template.data.y, // vertical positioning
                rotation: template.data.direction - 90, // the beam direction of the light in degrees (if its angle is less than 360 degrees.) 
                config: {
                    dim: template.data.distance, // the total radius of the light, including where it is dim.
                    bright: template.data.distance * 0.9, // the bright radius of the light
                    angle: MT.predefinedSpells[MT.template].angle, // the coverage of the light. (Try 30 for a "spotlight" effect.)

                    // Oddly, degrees are counted from the 6 o'clock position.
                    color: MT.predefinedSpells[MT.template].hex, // Light coloring.
                    alpha: 1
                } // Light opacity (or "brightness," depending on how you think about it.) 
            }];

            const light = await template.parent.createEmbeddedDocuments("AmbientLight", lightData);

            const key = "flags.effects-from-roll." + template.id;
            const updateData = {
                [key]: light[0].id,
            };
            template.update(updateData);
            MT.isTemplatedEffect = false;
        }
    });

    Hooks.on("deleteMeasuredTemplate", async (template) => {

        const lightID = template.getFlag('effects-from-roll', template.id);
        // if (lightID !== "undefined") {
        if (typeof lightID !== 'undefined') {
            const light = template.parent.getEmbeddedDocument("AmbientLight", lightID);
            template.parent.deleteEmbeddedDocuments("AmbientLight", [lightID]);
        }
    });

    Hooks.on("createChatMessage", async (chatMessage) => {

        if (chatMessage.data.flavor in MT.predefinedSpells) {
            MT.isTemplatedEffect = true;
            MT.template = chatMessage.data.flavor;
        }
        const actor = game.actors.get(chatMessage.data.speaker.actor);
        const item = actor.items.getName(chatMessage.data.flavor);

        const updates = [];
        // only check for items with effects
        item.effects.forEach(itemEffect => {
            // find effect on actor with same name as on item
            const actorEffect = actor.effects.find(ae => ae.data.label == itemEffect.data.label);
            updates.push({ _id: actorEffect.id, disabled: false });
        });
        // if the item is not equipped set it to euipped
        if (!getProperty(item.data, "data.equipped")) {
            await item.update({ ["data.equipped"]: true });
        }
        // don't update if array is empty
        if (updates.length > 0) {
            await actor.updateEmbeddedDocuments("ActiveEffect", updates);
        }
    });
});

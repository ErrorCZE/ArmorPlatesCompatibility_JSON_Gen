const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const items = JSON.parse(readFileSync(path.join(__dirname, "./items.json"))).results;

const armorCompatibility = {};

for (const item of items) {
    if (item.props?.Slots && Array.isArray(item.props.Slots)) {
        const armorId = item["Item ID"];
        armorCompatibility[armorId] = {};

        for (const slot of item.props.Slots) {
            const validSlotNames = ["Front_plate", "Back_plate", "Left_side_plate", "Right_side_plate"];
            if (slot?._name && validSlotNames.includes(slot._name)) {
                const customSlotName = getCustomSlotName(slot._name);
                armorCompatibility[armorId][customSlotName] = slot._props.filters[0].Filter;
            }
        }

        if (Object.keys(armorCompatibility[armorId]).length === 0) {
            delete armorCompatibility[armorId];
        }
    }
}

function getCustomSlotName(originalName) {
    const nameMappings = {
        "Front_plate": "FrontPlate",
        "Back_plate": "BackPlate",
        "Left_side_plate": "LeftSidePlate",
        "Right_side_plate": "RightSidePlate"
    };
    return nameMappings[originalName] || originalName;
}

if (Object.keys(armorCompatibility).length > 0) {
    const outputPath = path.join(__dirname, "ArmorPlateCompatibility.json");
    writeFileSync(outputPath, JSON.stringify(armorCompatibility, null, 2));
    console.log(`ArmorPlateCompatibility.json has been created successfully.`);
} else {
    console.log(`No items with plates found.`);
}

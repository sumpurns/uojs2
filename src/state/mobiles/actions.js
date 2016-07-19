import { Packet } from '../../network/packet';
import * as types from './actionTypes';
import * as flags from './flags';

export const receiveUpdateHealth = (socket, packet) => (dispatch) => {
    const serial = packet.getInt(1);
    const maxHealth = packet.getShort(5);
    const health = packet.getShort(7);

    // ?
    // is this for self or for all mobiles?
};

export const receiveMobileStats = (socket, packet) => (dispatch) => {
    packet.begin();

    const stats = {};
    stats.serial = packet.nextInt();

    stats.playerName = packet.nextString(30);
    stats.health = packet.nextShort();
    stats.maxHealth = packet.nextShort();
    stats.canChangeName = !packet.nextByte();
    stats.flag = packet.nextShort();

    stats.sex = packet.nextByte();

    stats.str = packet.nextShort();
    stats.dex = packet.nextShort();
    stats.int = packet.nextShort(); // how is this not a protected keyword?

    stats.stam = packet.nextShort();
    stats.maxStam = packet.nextShort();

    stats.mana = packet.nextShort();
    stats.maxMana = packet.nextShort();

    stats.gold = packet.nextInt();

    stats.armorClass = packet.nextShort();
    stats.weight = packet.nextShort();

    if (flag === 0x03 || flag === 0x04) {
        stats.statCap = packet.nextShort();
        stats.pets = packet.nextByte();
        stats.petsMax = packet.nextByte();
    }

    if (flag === 0x04) {
        stats.resist = {};
        stats.resist.fire = packet.nextShort();
        stats.resist.cold = packet.nextShort();
        stats.resist.poison = packet.nextShort();
        stats.resist.energy = packet.nextShort();

        stats.luck = packet.nextShort();
        stats.damangeMin = packet.nextShort();
        stats.damangeMax = packet.nextShort();
    }
}

import logger, { indent } from "shared/logger";

/**
 * 完成一个fiber节点
 * @param {*} current 
 * @param {*} workInPropress 
 */
export function completeWork (current, workInPropress) {
  indent.number -= 2;
  logger((" ").repeat(indent.number) + 'completeWork', workInPropress);

}
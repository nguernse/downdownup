/**
 * Identify whether the keystroke matches the combo direction.
 *
 * @param keyCode {number} Keystroke value entered by the user
 * @param targets Array<number> List of target values allowed
 */
export default function checkMatch(keyCode: number, targets: Array<number>) {
  return targets.indexOf(keyCode) > -1
}

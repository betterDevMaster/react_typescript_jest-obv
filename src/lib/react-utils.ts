/**
 * Functional react util to check if a given React child is a functional
 * component definition. Useful for HOCs.
 *
 * @param fn
 * @param component
 * @returns
 */
export function is<T>(
  fn: React.FC<T>,
  component: JSX.Element,
): fn is React.FC<T> {
  const componentName = component.type ? component.type.name : null
  return fn.name === componentName
}

/**
 * Whether an element has further elements as children.
 *
 * @param component
 * @returns
 */
export function hasChildren(component: JSX.Element) {
  return typeof component.props.children === 'object'
}

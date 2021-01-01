type Style = {
  x: number;
  y: number;
};

/**
 * A sorting function for ascending sorting.
 */
function asc(x: number, y: number) {
  return x < y ? -1 : x === y ? 0 : 1;
}

/**
 * The basic scene that can show a Qtie UI.
 */
export abstract class UIScene extends Scene_Base {
  readonly _ui: UIElement;
  readonly _background: Sprite | null;
  readonly _focusHandler: UIFocusHandler;
  readonly _context: UIContext;

  constructor() {
    super();
    this._ui = this.createScreen();
    this._background = null;
    this._focusHandler = new UIFocusHandler();
    this._context = new UIContext(this, this._focusHandler);
  }

  abstract createScreen(): UIElement;
  abstract onCancel(): void;

  create() {
    this._ui.render(this._context);
    this._focusHandler.initFocus();
  }

  update() {
    super.update();
    this._focusHandler.update();
    this._ui.update(this._context);
    this.handleInput();
  }

  handleInput() {
    if (Input.isTriggered("escape")) {
      this.onCancel();
    }
  }
}

export class UIFocusHandler {
  private _focus: UIFocusableElement | null;
  private _focusable: UIFocusableElement[];

  constructor() {
    this._focus = null;
    this._focusable = [];
  }

  addElement(element: UIFocusableElement) {
    this._focusable.push(element);
    this.maybeInitialiseFocusIndex(element);
    this.sort();
  }

  removeElement(element: UIFocusableElement) {
    this._focusable = this._focusable.filter((x) => x !== element);
  }

  maybeInitialiseFocusIndex(element: UIFocusableElement) {
    if (element.focusIndex == null) {
      const maxIndex = Math.max.apply(
        null,
        this._focusable.map((x) => x.focusIndex || 0)
      );
      element.focusIndex = maxIndex + 1;
    }
  }

  sort() {
    this._focusable.sort((e1, e2) =>
      asc(e1.focusIndex ?? 0, e2.focusIndex ?? 0)
    );
  }

  update() {
    this.handleInput();
  }

  handleInput() {
    if (Input.isTriggered("up") || Input.isTriggered("left")) {
      this.changeFocus(this.previous());
    }
    if (Input.isTriggered("down") || Input.isTriggered("right")) {
      this.changeFocus(this.next());
    }
    if (Input.isTriggered("ok")) {
      this.clickFocus();
    }
  }

  initFocus() {
    if (this._focus == null) {
      this.changeFocus(this.next());
    }
  }

  clickFocus() {
    if (this._focus) {
      this._focus.onClick();
    }
  }

  changeFocus(newFocus: UIFocusableElement | null) {
    if (newFocus != null) {
      if (this._focus) {
        this._focus.onBlur();
      }
      this._focus = newFocus;
      this._focus.onFocus();
    }
  }

  next() {
    const focusStart = this._focus?.focusIndex ?? -1;
    for (const candidate of this._focusable) {
      if (
        candidate !== this._focus &&
        candidate.isFocusable &&
        (candidate.focusIndex ?? -1) > focusStart
      ) {
        return candidate;
      }
    }
    return null;
  }

  previous() {
    const focusEnd = this._focus?.focusIndex ?? 9999;
    for (const candidate of this._focusable) {
      if (
        candidate !== this._focus &&
        candidate.isFocusable &&
        (candidate.focusIndex ?? 9999) < focusEnd
      ) {
        return candidate;
      }
    }
    return null;
  }
}

export class UIContext {
  readonly _container: Sprite;
  readonly _focusHandler: UIFocusHandler;

  constructor(container: Sprite, focusHandler: UIFocusHandler) {
    this._container = container;
    this._focusHandler = focusHandler;
  }

  with_container(container: Sprite) {
    return new UIContext(container, this._focusHandler);
  }

  addChild(element: Sprite) {
    this._container.addChild(element);
  }

  removeChild(element: Sprite) {
    this._container.removeChild(element);
  }

  addFocusable(element: UIFocusableElement) {
    this._focusHandler.addElement(element);
  }

  removeFocusable(element: UIFocusableElement) {
    this._focusHandler.removeElement(element);
  }
}

export abstract class UIElement {
  abstract render(ctx: UIContext): void;
  abstract update(ctx: UIContext): void;
}

export abstract class UIFocusableElement extends UIElement {
  abstract focusIndex: number | null;
  abstract isFocusable: boolean;
  abstract onFocus(): void;
  abstract onBlur(): void;
  abstract onClick(): void;
}

export class UIMapBackground extends UIElement {
  readonly _style: Style;
  readonly _container: Sprite;

  constructor(style0: Partial<Style>) {
    super();
    const style = { x: 0, y: 0, ...style0 };
    this._style = style;
    this._container = new Sprite(null);
    this.move(this._style.x, this._style.y);
  }

  move(x: number, y: number) {
    this._container.move(x, y);
  }

  render(ctx0: UIContext) {
    this._container.bitmap = SceneManager.backgroundBitmap();
    ctx0.addChild(this._container);
  }

  update(ctx0: UIContext) {
    this._container.update();
  }
}

export class UIBox extends UIElement {
  readonly _style: Style;
  readonly _children: UIElement[];
  readonly _container: Sprite;

  constructor(style0: Partial<Style>, children: UIElement[]) {
    super();
    const style = { x: 0, y: 0, ...style0 };
    this._style = style;
    this._children = children;
    this._container = new Sprite(null);
    this.move(this._style.x, this._style.y);
  }

  render(ctx0: UIContext) {
    ctx0.addChild(this._container);
    const ctx = ctx0.with_container(this._container);
    for (const child of this._children) {
      child.render(ctx);
    }
  }

  update(ctx0: UIContext) {
    const ctx = ctx0.with_container(this._container);
    for (const child of this._children) {
      child.update(ctx);
    }
    this._container.update();
  }

  move(x: number, y: number) {
    this._container.move(x, y);
  }
}

export class UIImage extends UIElement {
  readonly _style: Style & { image: string };
  readonly _bitmap: Bitmap;
  readonly _sprite: Sprite;

  constructor(style0: Partial<Style> & { image: string }) {
    super();
    const style = { x: 0, y: 0, ...style0 };
    this._style = style;
    this._bitmap = ImageManager.loadPicture(style.image, 0);
    this._sprite = new Sprite(this._bitmap);
    this.move(this._style.x, this._style.y);
  }

  move(x: number, y: number) {
    this._sprite.x = x;
    this._sprite.y = y;
  }

  render(ctx: UIContext) {
    ctx.addChild(this._sprite);
  }

  update(ctx: UIContext) {
    this._sprite.update();
  }
}

type ButtonStyle = {
  idle: UIElement;
  active?: UIElement;
  inactive?: UIElement;
  isActive?: boolean;
  focusIndex?: number;
  onClick?(): void;
};

export class UIButton extends UIFocusableElement {
  readonly _style: Style & ButtonStyle;
  readonly _container: Sprite;
  readonly _idle: UIElement;
  readonly _active: UIElement;
  readonly _inactive: UIElement;
  readonly _isActive!: boolean;
  private _lastDrawn: UIElement | null;
  private _hasFocus: boolean;
  public focusIndex: number | null;

  constructor(style0: Partial<Style> & ButtonStyle) {
    super();
    const style = { x: 0, y: 0, ...style0 };
    this._style = style;
    this._container = new Sprite(null);
    this._idle = style.idle;
    this._active = style.active || style.idle;
    this._inactive = style.inactive || style.idle;
    this.move(style.x, style.y);

    this._hasFocus = false;

    if (style0.hasOwnProperty("isActive")) {
      Object.defineProperty(
        this,
        "_isActive",
        Object.getOwnPropertyDescriptor(style0, "isActive") as any
      );
    } else {
      this._isActive = true;
    }

    this._lastDrawn = null;
    this.focusIndex = this._style.focusIndex ?? null;
  }

  onFocus() {
    this._hasFocus = true;
  }

  onBlur() {
    this._hasFocus = false;
  }

  onClick() {
    this._style.onClick?.();
  }

  render(ctx0: UIContext) {
    ctx0.addChild(this._container);
    ctx0.addFocusable(this);
    const ctx = ctx0.with_container(this._container);
    const current = this.currentElement;
    current.render(ctx);
    this._lastDrawn = current;
  }

  update(ctx0: UIContext) {
    const ctx = ctx0.with_container(this._container);
    const current = this.maybeSwapRender(ctx);
    current.update(ctx);
  }

  maybeSwapRender(ctx: UIContext) {
    const current = this.currentElement;
    if (current !== this._lastDrawn) {
      this._reset();
      current.render(ctx);
      this._lastDrawn = current;
    }

    return current;
  }

  _reset() {
    for (const child of this._container.children) {
      this._container.removeChild(child);
    }
  }

  get currentElement() {
    if (!this._isActive) {
      return this._inactive;
    } else if (this._hasFocus) {
      return this._active;
    } else {
      return this._idle;
    }
  }

  get isFocusable() {
    return this._isActive;
  }

  move(x: number, y: number) {
    this._container.move(x, y);
  }
}

type TransformStyle = {
  opacity?: number;
  angle?: number;
};

export class UITransform extends UIElement {
  readonly _style: Style & TransformStyle;
  readonly _child: UIElement;
  readonly _container: Sprite;

  constructor(style0: Partial<Style> & TransformStyle, child: UIElement) {
    super();
    const style = {
      x: 0,
      y: 0,
      opacity: 1,
      angle: 0,
      ...style0,
    };
    this._style = style;
    this._child = child;
    this._container = new Sprite(null);
    this._container.move(this._style.x, this._style.y);
    this._container.angle = style.angle;
    this._container.alpha = style.opacity;
  }

  render(ctx0: UIContext) {
    ctx0.addChild(this._container);
    const ctx = ctx0.with_container(this._container);
    this._child.render(ctx);
    this._container.update();
  }

  update(ctx0: UIContext) {
    const ctx = ctx0.with_container(this._container);
    this._child.update(ctx);
  }

  move(x: number, y: number) {
    this._container.move(x, y);
  }
}

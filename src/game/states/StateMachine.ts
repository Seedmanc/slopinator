export interface IState
{
	name?: string|number
	onEnter?: (...args ) => void
	onUpdate?: (args?) => void
	onExit?: (args?) => void
	final?: boolean;
}

let idCount = 0

export default class StateMachine
{
	private id = (++idCount).toString()
	private context: object
	private states = new Map<string|number, IState>()

	previousState?: IState
	private currentState!: IState
	private isChangingState = false
	private changeStateQueue: (string|number)[] = []

	constructor(context: object, id?: string) {
		this.id = id ?? this.id
		this.context = context
	}

	isCurrentState(name: string|number)	{
		return this.currentState?.name == name
	}

	addState(name: string|number, config?: IState)	{
		const context = this.context

		this.states.set(name, {
			name,
			onEnter: config?.onEnter?.bind(context),
			onUpdate: config?.onUpdate?.bind(context),
			onExit: config?.onExit?.bind(context),
			final: config?.final
		})

		return this
	}

	setState(name: string|number, payload?: any)
	{
		if (!this.states.has(name))	{
			console.warn(`Tried to change to unknown state: ${name}`)
			return
		}

		if (this.isCurrentState(name))
			return

		if (this.currentState?.final)
			return;

		if (this.isChangingState) {
			this.changeStateQueue.push(name)
			return
		}

		this.isChangingState = true

		if (this.context['scene'].physics.world.drawDebug)
			console.log(`[StateMachine (${this.id})] change from ${this.currentState?.name} to ${name}`)

		if (this.currentState && this.currentState.onExit)
			this.currentState.onExit(this.context)

		this.previousState = this.currentState
		this.currentState = this.states.get(name);

		if (this.currentState.onEnter)
			this.currentState.onEnter(this.context, payload)

		this.isChangingState = false
	}

	update(...args)	{
		if (this.changeStateQueue.length > 0) {
			this.setState(this.changeStateQueue.shift())
			return
		}

		if (this.currentState && this.currentState.onUpdate)
			this.currentState.onUpdate(...args)
	}
}

import { Component, createRef, type ReactNode } from 'react'
import { Brand } from './Brand'
import './AppErrorBoundary.css'

interface Props {
  children: ReactNode
  reloadPage?: () => void
}
interface State {
  failed: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }
  private heading = createRef<HTMLHeadingElement>()

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch() {
    this.heading.current?.focus()
  }

  private retry = () => {
    this.setState({ failed: false })
  }

  private reload = () => {
    if (this.props.reloadPage) this.props.reloadPage()
    else window.location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="app-recovery">
        <section
          className="app-recovery-panel"
          aria-labelledby="recovery-title"
        >
          <Brand />
          <div role="alert">
            <h1 id="recovery-title" tabIndex={-1} ref={this.heading}>
              This screen could not open
            </h1>
            <p>
              Try opening it again. If the problem continues, reload the page to
              load a fresh copy of the application.
            </p>
          </div>
          <div className="app-recovery-actions">
            <button className="button primary" onClick={this.retry}>
              Try again
            </button>
            <button className="button secondary" onClick={this.reload}>
              Reload page
            </button>
          </div>
          <p className="app-recovery-note">Unsaved changes may be lost.</p>
        </section>
      </main>
    )
  }
}

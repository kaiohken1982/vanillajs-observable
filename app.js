class App 
{
  constructor() {

    const observable = {
      listenerRef: null,
      subscribe: function(observer) {
        this.listenerRef = function(event) {
          observer.next(event.clientX)
        }
        document.addEventListener("click", this.listenerRef)
      },
      pipe: function(operator) {
        return operator(this)
      },
      unsubscribe: function() {
        document.removeEventListener("click", this.listenerRef)
        console.log('unsubscribe done')
      }
    }

    const map = function (f) {
      return observable => {
        return {
          subscribe: observer => {
            observable.subscribe({
              next: x => {
                observer.next(f(x))
              },
              error: err => {
                console.error(err)
              },
              complete: () => {
                console.log("finished")
              }
            })

            return observable.originalObservable ? observable.originalObservable : observable
          }, 
          pipe: function (operator) {
            return operator(this)
          },
          originalObservable: observable
        }
      }
    }

    this.myObservable$ = observable
      .pipe(map(clientX => clientX - 100))
      .pipe(map(clientX => clientX - 600))

  }

  bootstrap() {
    console.log('Bootstrapped!')

    const observer = {
      next: x => {
        console.log(x)
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        console.log("done")
      }
    }

    let ref = this.myObservable$.subscribe(observer)

    setTimeout(() => {
      ref.unsubscribe()
    }, 2000)
    
  }
}


let app = new App()
app.bootstrap()
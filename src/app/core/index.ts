import EventEmitter from "./api/event-emitter.api";
import Fitter from "./api/fitter.api";
import Http from "./api/http.api";

class Core {
  static readonly eventEmitter = new EventEmitter();
  static readonly http = Http.initialize();

  private readonly fitter = new Fitter();

  static setup(): void {
    const app = new Core();

    app.fitter.bootstrap();

    return void 0;
  }
}

export default Core;

class ParamsError {
  isCanceled: boolean;
  constructor({ isCanceled }: { isCanceled: boolean }) {
    this.isCanceled = isCanceled;
  }
}

export class MakeCancelable<Res = any> {
  private hasCanceled_ = false;
  public promise: Promise<Res>;
  constructor(promiseProp: Promise<Res>) {
    this.promise = new Promise<Res>((resolve, reject) => {
      promiseProp.then(
        val =>
          this.hasCanceled_
            ? reject(new ParamsError({ isCanceled: true }))
            : resolve(val),
        error => {
          if (!this.hasCanceled_) reject(error);
        },
      );
    });
  }

  cancel() {
    this.hasCanceled_ = true;
  }
}

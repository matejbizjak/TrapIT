import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
    // TODO the domain shall change
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf("/assets/i18n") < 0) { // prevodi so na odjemalcu
            const url = "http://localhost:3000/api";
            // const url = "http://localhost:3000/api"; TODO
            req = req.clone({
                url: url + req.url
            });
        }
        return next.handle(req);
    }
}

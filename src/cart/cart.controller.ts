import {Controller} from "../utils/controller";
import {Response, Router} from "express";
import {CartService} from "./cart.service";
import {AuthRequest} from "../auth/auth.request";
import {Product, QuantityBody} from "./cart.interfaces";
import {productSchema, quantityBodySchema} from "./validation/req.data";
import {validate} from "../utils/validator";

export const CART_PATH = "/cart";
export const PRODUCT_PATH = "/product";
export const QUANTITY_PATH = "/quantity";

export class CartController implements Controller {
    router = Router();

    constructor(private cartService: CartService) {
        this.router.get(`${CART_PATH}${PRODUCT_PATH}`, (req: AuthRequest, res: Response) =>
            this.getCart(req.user.id).then(cart => res.status(200).json(cart)))

        this.router.post(`${CART_PATH}${PRODUCT_PATH}`, validate(productSchema), (req: AuthRequest, res: Response) =>
            this.addProduct(req.user.id, req.body).then(() => res.sendStatus(201)))

        this.router.delete(`${CART_PATH}${PRODUCT_PATH}/:productId`, (req: AuthRequest, res: Response) =>
            this.deleteProduct(req.user.id, req.params.productId).then(() => res.sendStatus(200)))

        this.router.put(`${CART_PATH}${PRODUCT_PATH}/:productId${QUANTITY_PATH}`, validate(quantityBodySchema), (req: AuthRequest, res: Response) =>
            this.changeQuantity(req.user.id, req.params.productId, req.body).then(() => res.sendStatus(200)))
    }

    getCart(userId: string) {
        return this.cartService.getCart(userId);
    }

    addProduct(userId: string, product: Product) {
        return this.cartService.addProduct(userId, product);
    }

    deleteProduct(userId: string, productId: string) {
        return this.cartService.deleteProduct(userId, productId);
    }

    changeQuantity(userId: string, productId: string, body: QuantityBody) {
        return this.cartService.changeQuantity(userId, productId, body);
    }
}
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ContainerType, ProductType } from "../../types";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import Product from "../product/Product.tsx";
// import AddNewSectionButton from "../add-new-section-button/AddNewSectionButton.tsx";
import { addCommasToNumber } from "../../utils/numberManipulations.ts";

interface Props {
    container: ContainerType;
    products: ProductType[];
    setStep1Sum: React.Dispatch<React.SetStateAction<number>>;
    setStep2Sum: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}

function ProductList({
    container,
    products,
    setStep1Sum,
    setStep2Sum,
    className,
}: Props) {
    const [productsSum, setProductsSum] = useState(0);
    const productsIds = useMemo(() => {
        const productsArr = [...products];
        const totalPrice = productsArr.reduce((accumulator, currentValue) => {
            return accumulator + parseFloat(currentValue.price + ""); // The reduce func adds up the numbers as strings for some reason, so I wrapped the price in parseFloat and also because TS yells at me I had to turn it into a string
        }, 0);
        // console.log(totalPrice);
        setProductsSum(totalPrice);
        return products.map((product) => product.id);
    }, [products]);

    useEffect(() => {
        if (container.id === "chosenProductsContainer_step1") {
            setStep1Sum(productsSum);
        }

        if (container.id === "chosenProductsContainer_step2") {
            setStep2Sum(productsSum);
        }
    }, [productsSum]);

    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: container.id,
        data: {
            type: "Container",
            container,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        // console.log(style);
        return <li className="product--drag-overlay" ref={setNodeRef} style={style}></li>;
    }

    return (
        <ul ref={setNodeRef} style={style} className={className}>
            {container.id === "allProductsContainer" ? (
                <SortableContext items={productsIds}>
                    {products.map((product) => (
                        <Product key={product.id} product={product} className="product" />
                    ))}
                </SortableContext>
            ) : container.id === "chosenProductsContainer_step1" ? (
                <>
                    <h3 className="chosen-products--step1">שלב 1 - בניית התשתית</h3>
                    <div className="chosen-products-inner-wrapper">
                        <SortableContext items={productsIds}>
                            {products.map((product) => (
                                <Product key={product.id} product={product} className="product" />
                            ))}
                        </SortableContext>
                    </div>
                    {/* <SortableContext items={productsIds}>
                        {products.map((product) => (
                            <Product key={product.id} product={product} className="product" />
                        ))}
                    </SortableContext> */}
                    <div className="products-step-sum">
                        <p>עלות כוללת (שלב 1): ₪{addCommasToNumber(productsSum)}</p>
                    </div>
                </>
            ) : container.id === "chosenProductsContainer_step2" ? (
                <>
                    <h3 className="chosen-products--step2">שלב 2 - יישום בפועל</h3>
                    <div className="chosen-products-inner-wrapper">
                        <SortableContext items={productsIds}>
                            {products.map((product) => (
                                <Product key={product.id} product={product} className="product" />
                            ))}
                        </SortableContext>
                    </div>
                    {/* <SortableContext items={productsIds}>
                        {products.map((product) => (
                            <Product key={product.id} product={product} className="product" />
                        ))}
                    </SortableContext> */}
                    <div className="products-step-sum">
                        <p>עלות כוללת (שלב 2): ₪{addCommasToNumber(productsSum)}</p>
                    </div>
                </>
            ) : null}
        </ul>
    );
}

export default ProductList;

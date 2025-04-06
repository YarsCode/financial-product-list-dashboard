import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ContainerType, DataObj, ProductType } from "../../types";
import ProductList from "../product-list/ProductList.tsx";
import refreshIcon from "../../assets/refreshIcon.svg";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Product from "../product/Product.tsx";
import allContainers from "../../utils/containers.ts";
import { turnDataIntoObject } from "../../utils/productList.ts";
import Loader from "../loader/Loader.tsx";
import ExportButton from "../export-button/ExportButton.tsx";
import { addCommasToNumber } from "../../utils/numberManipulations.ts";
import { calculateInputWidthByContent } from "../../utils/calculateInputWidthByContent.ts";
import { setDashboardData } from "../../utils/setDashboardData.ts";
// import productList from "../../utils/productList.ts";

const { allProductsContainer, chosenProductsContainer } = allContainers;

const defaultAllProductsContainer: ContainerType[] = allProductsContainer;
const defaultChosenProductsContainer: ContainerType[] = chosenProductsContainer;

// const defaultProducts: ProductType[] = productList;

function ProductListDashboard() {
    // const [defaultProducts, setDefaultProducts] = useState<ProductType[]>([]);
    const [allProductsContainer, setAllProductsContainer] = useState<ContainerType[]>(defaultAllProductsContainer);
    const [chosenProductsContainer] = useState<ContainerType[]>(defaultChosenProductsContainer);
    const [hasClickedResetBtn, setHasClickedResetBtn] = useState(false);
    const [customerName, setCustomerName] = useState("שם הלקוח");
    const [customerPhone, setCustomerPhone] = useState("ID-" + Date.now().toString());
    const [products, setProducts] = useState<ProductType[]>([]);
    const [step1Total, setStep1Total] = useState(0);
    const [step2Total, setStep2Total] = useState(0);
    const [step3Total, setStep3Total] = useState(0);
    const [totalSum, setTotalSum] = useState(step1Total + step2Total);
    const [dataObj, setDataObj] = useState<DataObj>({
        customerName: '',
        customerPhone: '',
        currentDate: '',
        planningStep1: [],
        step1Total: 0,
        planningStep2: [],
        step2Total: 0,
        totalSum: 0,
      });
    const [inputWidth, setInputWidth] = useState("114px");
    const customerNameRef = useRef<HTMLInputElement>(null);
    // const [dashboardData, setDashboardData] = useState({})
    const allProductsContainerId = useMemo(
        () => allProductsContainer.map((container) => container.id),
        [allProductsContainer]
    );
    const chosenProductsContainerId = useMemo(
        () => chosenProductsContainer.map((container) => container.id),
        [chosenProductsContainer]
    );

    const [activeContainer, setActiveContainer] = useState<ContainerType | null>(null);

    const [activeProduct, setActiveProduct] = useState<ProductType | null>(null);

    const [activeSection, setActiveSection] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 2,
            },
        })
    );

    useEffect(() => {
        turnDataIntoObject().then((res) => {
            if (res) setProducts(res);
        });
    }, []);

    useEffect(() => {
        if (hasClickedResetBtn) {
            turnDataIntoObject().then((res) => {
                if (res) setProducts(res);
            });

            setHasClickedResetBtn(false);
        }
    }, [hasClickedResetBtn]);

    useEffect(() => {
        // Only include step1 and step2 in the total sum (one-time fees)
        // step3 (monthly fees) is deliberately excluded from the total
        setTotalSum(step1Total + step2Total);
    }, [step1Total, step2Total]);

    useEffect(() => {
        calculateInputWidthByContent(customerNameRef, setInputWidth);
    }, [customerName]);

    useMemo(() => {
        setDataObj(setDashboardData(customerName, customerPhone, products, step1Total, step2Total, step3Total, totalSum, activeSection));
    }, [customerName, customerPhone, products, step1Total, step2Total, step3Total, totalSum, activeSection]);

    //! console.log('products', products); // Check why this renders twice

    if (!products.length) {
        return (
            <Loader imgSrc='<img width="800" height="490" src="https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-1024x627.webp" class="attachment-large size-large wp-image-16239" alt="לוגו עם אייקון future תכנון פיננסי" srcset="https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-1024x627.webp 1024w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-300x184.webp 300w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-768x471.webp 768w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי.webp 1508w" sizes="(max-width: 800px) 100vw, 800px" data-node-item="1676">' />
        );
    }

    const handleCustomerNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCustomerName(e.target.value);
    };

    const handleCustomerPhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const regex = /^\+?[0-9]*$/;
        const initValue = "ID-" + Date.now().toString();
        
        if (!value.length) { //TODO: set timestamp if value is empty
            setCustomerPhone(initValue);
        }

        if (value && regex.test(value)) {
            setCustomerPhone(value);
        }
    };

    const handlePhoneInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;

        // Allow control keys such as Backspace, Delete, Tab, etc.
        if (
            key === "Backspace" ||
            key === "Delete" ||
            key === "ArrowLeft" ||
            key === "ArrowRight" ||
            key === "Tab" ||
            e.ctrlKey ||
            e.altKey ||
            e.metaKey || // Meta key is the "Command" key on macOS
            e.shiftKey
        ) {
            return;
        }

        // Get current value of the input
        const value = e.currentTarget.value;

        // Only allow '+' as the first character
        if (key === "+" && value.length === 0) {
            return;
        }

        // Prevent any non-numeric keys (except '+' as the first character)
        if (!/^[0-9]$/.test(key)) {
            e.preventDefault();
        }
    };

    const renderContainers = (container: ContainerType) => {
        return (
            <ProductList
                key={container.id}
                container={container}
                products={products.filter((product) => product.container === container.id)}
                setStep1Total={setStep1Total}
                setStep2Total={setStep2Total}
                setStep3Total={setStep3Total}
                setActiveSection={setActiveSection}
                className={`product-list-container${
                    container.id !== "allProductsContainer" ? " chosen-products-container" : ""
                }`}
            />
        );
    };

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Container") {
            setActiveContainer(event.active.data.current.container);
            return;
        }

        if (event.active.data.current?.type === "Product") {
            setActiveProduct(event.active.data.current.product);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveContainer(null);
        setActiveProduct(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        // console.log("Just dragged: ", event.active.data.current?.product);
        if (activeId === overId) return;

        const isActiveAContainer = active.data.current?.type === "Container";
        if (!isActiveAContainer) return;

        // console.log("DRAG END");

        setAllProductsContainer((allProductsContainer) => {
            const activeContainerIndex = allProductsContainer.findIndex((container) => container.id === activeId);

            const overContainerIndex = allProductsContainer.findIndex((container) => container.id === overId);

            return arrayMove(allProductsContainer, activeContainerIndex, overContainerIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAProduct = active.data.current?.type === "Product";
        const isOverAProduct = over.data.current?.type === "Product";

        if (!isActiveAProduct) return;

        if (isActiveAProduct && isOverAProduct) {
            setProducts((products) => {
                const activeIndex = products.findIndex((product) => product.id === activeId);
                const overIndex = products.findIndex((product) => product.id === overId);

                if (products[activeIndex].container != products[overIndex].container) {
                    // Prevent dropping into step3 container
                    if (products[overIndex].container === "chosenProductsContainer_step3") {
                        return [...products];
                    }
                    
                    products[activeIndex].container = products[overIndex].container;
                    return arrayMove(products, activeIndex, overIndex - 1);
                }

                return arrayMove(products, activeIndex, overIndex);
            });
        }

        const isOverAContainer = over.data.current?.type === "Container";

        if (isActiveAProduct && isOverAContainer) {
            setProducts((products) => {
                const activeIndex = products.findIndex((product) => product.id === activeId);

                // Prevent dropping into step3 container
                if (overId === "chosenProductsContainer_step3") {
                    return [...products];
                }
                
                if (typeof overId === "string") {
                    products[activeIndex].container = overId;
                }
                return arrayMove(products, activeIndex, activeIndex);
            });
        }
    }

    return (
        <main className="product-lists-main">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="product-lists-container">
                    <button className="reset-board-btn-wrapper" onClick={() => setHasClickedResetBtn(true)}>
                        <img src={refreshIcon} alt="refresh" />
                    </button>
                    <SortableContext items={allProductsContainerId}>
                        {allProductsContainer.map((container) => renderContainers(container))}
                    </SortableContext>
                    <div className="chosen-products-title-wrapper">
                        <h2>
                            תהליך תכנון פיננסי -
                            <input
                                type="text"
                                onChange={handleCustomerNameChange}
                                ref={customerNameRef}
                                className="customer-name"
                                autoFocus
                                placeholder="שם הלקוח"
                                style={{ width: inputWidth }}
                            />

                        <span className="phone-separator"></span>
                        <label htmlFor="phone"></label>
                        <input
                            type="tel"
                            id="customer-phone"
                            name="phone"
                            placeholder="טלפון"
                            onChange={handleCustomerPhoneChange}
                            onKeyDown={handlePhoneInputKeyDown}
                            required
                        />
                        </h2>


                        <div className="chosen-products-container">
                            <div className="chosen-products-wrapper">
                                <SortableContext items={chosenProductsContainerId}>
                                    {chosenProductsContainer.map((container) => renderContainers(container))}
                                </SortableContext>
                            </div>
                            <div className="products-total-sum">
                                <p>עלות כל התהליך: ₪{addCommasToNumber(totalSum)}</p>
                            </div>
                        </div>
                    </div>
                    <ExportButton dataObj={dataObj} />
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeContainer && (
                            <ProductList
                                key={activeContainer.id}
                                container={activeContainer}
                                setStep1Total={setStep1Total}
                                setStep2Total={setStep2Total}
                                setStep3Total={setStep3Total}
                                products={products.filter((product) => product.container === activeContainer.id)}
                            />
                        )}
                        {activeProduct && (
                            <Product key={activeProduct.id} product={activeProduct} className="product" />
                        )}
                        {/* {activeProduct && <Product product={activeProduct} updateProduct={updateProduct} />} */}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </main>
    );
}

export default ProductListDashboard;

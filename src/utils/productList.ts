import { ProductType } from "../types";

const sheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEET_ID}/values/Sheet1?key=${import.meta.env.VITE_SHEETS_API_KEY}`;

// This function performs a GET request to the given URL and returns the response as JSON.

export const fetchApiData = async (url: string) => {
    try {
        // Perform the GET request
        const response = await fetch(url, {
            method: "GET", // Specifies the request method
            headers: {
                "Content-Type": "application/json", // Sets header to accept JSON response
            },
        });

        // Check if the HTTP status code is in the successful range
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response body as JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetching error:", error);
        throw error;
    }
}

// fetchApiData(sheetsURL);

export async function turnDataIntoObject(): Promise<ProductType[] | undefined> {
    try {
        const data = await fetchApiData(sheetsURL);
        const keys = data.values[0];

        // Initialize an array to hold the objects
        const objects: ProductType[] = [];

        // Iterate over each row starting from the second row
        for (let i = 1; i < data.values.length; i++) {
            const obj: Partial<ProductType> = {};

            // Create an object where each key is assigned the value from the current row
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j] as keyof ProductType] = data.values[i][j];
            }

            obj.id = i.toString(); // Gives an id for each product so the user won't have to deal with it from the google sheets
            obj.container = "allProductsContainer"; // Puts the products in a default container. I didn't want to let the user to be able to change it from google sheets

            // Push the created object into the objects array
            objects.push(obj as ProductType);
        }

        return objects;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

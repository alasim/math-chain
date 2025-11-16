export function performOperation(
    left: number,
    op: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE",
    right: number
): number {
    switch (op) {
        case "ADD":
            return left + right;
        case "SUBTRACT":
            return left - right;
        case "MULTIPLY":
            return left * right;
        case "DIVIDE":
            if (right === 0) throw new Error("Cannot divide by zero");
            return left / right;
    }
}

export function calculateResult(
    left: number,
    op: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE",
    right: number
): number {
    return performOperation(left, op, right);
}

export function getSign(op: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE"): string {
    switch (op) {
        case "ADD":
            return "+";
        case "SUBTRACT":
            return "-";
        case "MULTIPLY":
            return "*";
        case "DIVIDE":
            return "/";
    }
}


export function buildTree(rows: any[], rootId: string) {
    const map: any = {};
    rows.forEach(row => (map[row.id] = { ...row, children: [] }));

    let root = null;

    rows.forEach(row => {
        if (!row.parentId) {
            root = map[row.id];
        } else {
            map[row.parentId].children.push({
                ...map[row.id],
                parentValue: map[row.parentId].value,
            });
        }
    });

    return map[rootId];
}

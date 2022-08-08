class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinaryTreeString {
    constructor() {
        this.root = null;
        this.length = 0;
        this.depth = 1;
        this.depthNodes = [];
        this.depthNodes.push({nodes: 0});
    }

    getRootNode()
    {
        return this.root;
    }

    insertValue(value) {
        if (typeof value !== "string") {
            return;
        }

        this.length ++;

        const node = new Node(value);

        if (this.root === null) {
            this.root = node;

            return node;
        }

        this.insertNode(this.root, node);
    }

    insertNode(node, nodeToAdd) {
        const maxNodesOnDepth = this.depth * 2;
        const depthArrayPosition = this.depth - 1;

        if (node.left === null) {
            node.left = nodeToAdd;
            this.depthNodes[depthArrayPosition].nodes ++;
        } else if (node.right === null) {
            node.right = nodeToAdd;
            this.depthNodes.push({nodes: 0});    

        } else if (maxNodesOnDepth === this.depthNodes[depthArrayPosition].nodes) {
            this.depth ++;
            this.depthNodes[depthArrayPosition] = { nodes: 0 };

            this.insertNode(node.left, nodeToAdd);
        } else {
            const nodeToInsert = this.depthNodes[depthArrayPosition].nodes + 1 === maxNodesOnDepth ? node.left : node.right;

            this.insertNode(nodeToInsert, nodeToAdd);
        }
    }

    async depthFirst(node) {
        if (node === null) return [];

        const getDepthValues = await Promise.all([
            await this.depthFirst(node.left),
            await this.depthFirst(node.right)
        ]);

        return [node.value, ...getDepthValues[0], ...getDepthValues[1]];
    }

    breadthFirst(node) {
        if (node === null) return [];
        const queueNodes = [ node ];
        const values = [];

        while (queueNodes.length > 0) {
            const current = queueNodes.shift();
            values.push(current.value);

            if (current.left !== null) {
                queueNodes.push(current.left);
            }

            if (current.right !== null) {
                queueNodes.push(current.right);
            }
        }

        return values;
    }

    search(value) {
        if (typeof value !== "string") return [];
        
        const queueNodes = [ this.getRootNode() ];
        let valueFounded = null;

        while (queueNodes.length > 0) {
            const current = queueNodes.shift();
            if (current.value === value) {
                valueFounded = value;

                break;
            }

            if (current.left !== null) {
                queueNodes.push(current.left);
            }

            if (current.right !== null) {
                queueNodes.push(current.right);
            }
        }

        return valueFounded ? true : false;
    }

    treeIncludes(root, target) {
        if (root === null) return false;
        
        if (root.value === target) return true;

        return this.treeIncludes(root.left, target) || this.treeIncludes(root.right, target);
        
    }
}

async function main() {
    const binaryTreeStr = new BinaryTreeString();
    binaryTreeStr.insertValue("a");
    binaryTreeStr.insertValue("b");
    binaryTreeStr.insertValue("c");
    binaryTreeStr.insertValue("d");
    binaryTreeStr.insertValue("e");
    binaryTreeStr.insertValue("f");

    const depthFirst = await binaryTreeStr.depthFirst(binaryTreeStr.getRootNode());

    console.log("depthFirst result: ", depthFirst);

    const breadthFirst = binaryTreeStr.breadthFirst(binaryTreeStr.getRootNode());

    console.log("breadthFirst result: ", breadthFirst);

    const searchValue = binaryTreeStr.search("f");

    console.log("searchValue: f exists on tree?", searchValue);

    const treeIncludes = binaryTreeStr.treeIncludes(binaryTreeStr.getRootNode(), "f");

    console.log("treeIncludes: d exists on tree?", treeIncludes);
}


if (require.main === module) {
    main();
  }
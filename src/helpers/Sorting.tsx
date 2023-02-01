const InsertionSort = (distances: number[]) => {
    let length = distances.length

    let order: number[] = []
    for (let i = 0; i < distances.length; i++) { order.push(i) }

    function Swap(indexA: number, indexB: number) {

        let temp: number = order[indexA]

        order[indexA] = order[indexB]
        order[indexB] = temp
    }

    for (let i: number = 1; i <= length; i++) {
        let j: number = i
        while (j > 0 && distances[order[j-1]] > distances[order[j]]) {
            Swap(j-1, j)
            j = j - 1
        }
    }

    return order
}

const BubbleSort = (distances: number[]) => {
    let order: number[] = []
    for (let i = 0; i < distances.length; i++) { order.push(i) }

    if(order.length < 2) return order

    function Swap(indexA: number, indexB: number) {

        let temp: number = order[indexA]

        order[indexA] = order[indexB]
        order[indexB] = temp
    }

    let numSwaps: number = 0
    let doLoop: boolean = true
    let maxIterations: number = 10000
    let iterations: number = 0

    while(doLoop && iterations < maxIterations) {
        for (let i = 0; i < order.length; i++) {
            //Check if we've reached the last index
            if(i >= (order.length - 1)) {
                if(numSwaps === 0) doLoop = false
                break
            }
            const distance = distances[order[i]]
            const nextDistance = distances[order[i+1]]

            if(distance > nextDistance) {
                Swap(i, i+1)
                numSwaps = numSwaps + 1
            }
            iterations = iterations + 1
        }
    }

    return order
}

const SelectionSort = (distances: number[]) => {
    let order: number[] = []
    for (let i = 0; i < distances.length; i++) { order.push(i) }

    if(order.length < 2) return order

    function Swap(indexA: number, indexB: number) {
        if(indexA === indexB) return

        let temp: number = order[indexA]

        order[indexA] = order[indexB]
        order[indexB] = temp
    }

    const length = order.length

    for (let i = 0; i < length-1; i++) {

        let minIndex = i
        for (let j = i+1; j < length; j++) {
            if(distances[order[j]] < distances[order[minIndex]])
                minIndex = j
        }

        Swap(minIndex, i)
    }

    return order
}

export {
    InsertionSort,
    BubbleSort,
    SelectionSort
}
@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Decision Tree')

@push('head')
    <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
@endpush

@section('content')
    <div class="w-full h-full flex flex-col items-center justify-center p-8">
        <img id="decision-tree-errors-image" 
             class="hidden max-w-full h-auto" 
             alt="Decision Tree Visualization">
        <img id="best-decision-tree-image" 
             class="hidden max-w-full h-auto" 
             alt="Decision Tree Visualization">
    </div>

    <script>
        (async () => {
            const pyodide = await loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            });

            await pyodide.loadPackage(['pandas', 'scikit-learn', 'matplotlib']);

            const csvResponse = await fetch('/data/dataset_sessions.csv');
            const csvText = await csvResponse.text();
            pyodide.FS.writeFile('/dataset_sessions.csv', csvText);

            const pyResponse = await fetch('/data/rtc_browser.py');
            const pyCode = await pyResponse.text();
            pyodide.runPython(pyCode);

            const results = pyodide.runPython('run_decision_tree_analysis()');
            const jsResults = results.toJs({dict_converter: Object.fromEntries});

            const errorsImg = document.getElementById('decision-tree-errors-image');
            errorsImg.src = `data:image/png;base64,${jsResults.error_graph_base64}`;
            errorsImg.classList.remove('hidden');

            const treeImg = document.getElementById('best-decision-tree-image');
            treeImg.src = `data:image/png;base64,${jsResults.tree_image_base64}`;
            treeImg.classList.remove('hidden');
        })();
    </script>
@endsection


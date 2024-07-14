### Create a github action to automatically create a compression dict 

Outline 

1. Create a gihtub workflow similar to this:
```yml
on:
  push:
    paths:
      - 'src/data/lab_data.js'
      - 'src/data/theory_data.js'
jobs:
  update_compression_dict:
    runs-on: ubuntu-latest
    steps:
      - name: checkout repo content
        uses: actions/checkout@v3 # checkout the repository content to github runner.
      - name: setup python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11 #install the python needed
      # - name: Install dependencies
      #   run: |
      #     if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      - name: execute py script
        working_dir: ./preprocessing
        run: |
          python generate.py
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add .
          git commit -m "crongenerated"
          git push
```

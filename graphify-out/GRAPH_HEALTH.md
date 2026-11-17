[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 1822
unverified_code_nodes: 0
raw_edges: 3012
valid_candidate_edges: 2807
missing_endpoint_edges: 0
dangling_endpoint_edges: 205
self_loop_edges: 0
exact_duplicate_edges: 3
directed_unique_endpoint_pairs: 2780
directed_same_endpoint_collapsed_edges: 27
undirected_unique_endpoint_pairs: 2777
undirected_same_endpoint_collapsed_edges: 30
same_endpoint_group_count: 20
relation_variant_groups: 9
source_file_variant_groups: 0
source_location_variant_groups: 5
context_variant_groups: 0
post_build_graph_type: Graph
post_build_edges: 2776
producer_suppression_sites: 12
producer_suppression_examples:
  - L1204 seen_ids arity=unknown
  - L1520 seen_ids arity=unknown
  - L1522 seen_doc_refs arity=unknown
  - L1885 seen_ids arity=unknown
  - L2032 seen_ids arity=unknown
  - L2670 seen_keys arity=unknown
  - L2839 seen_keys arity=unknown
  - L4436 seen_ids arity=unknown
examples:
  - motion_reel_reel -> motion_reel_reel_draw edges=8 relations=['contains'] locations=['L1099', 'L1159', 'L1340', 'L1416', 'L319', 'L557', 'L771', 'L926'] contexts=['']
  - src_components_site_header_siteheader -> src_components_site_header_siteheader_onkeydown edges=3 relations=['contains', 'indirect_call'] locations=['L177', 'L189', 'L214'] contexts=['', 'argument']
  - motion_reel_reel -> motion_reel_reel_tone edges=2 relations=['contains'] locations=['L1334', 'L767'] contexts=['']
  - scripts_check_blog -> src_lib_blog_getposts edges=2 relations=['imports', 'indirect_call'] locations=['L2', 'L42'] contexts=['argument', 'import']
  - scripts_check_guide -> src_lib_guide_getguide edges=2 relations=['imports', 'indirect_call'] locations=['L2', 'L68'] contexts=['argument', 'import']
note: normal graph.json is post-build; raw producer loss must be measured earlier.
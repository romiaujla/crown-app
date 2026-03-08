#!/usr/bin/env bash
# Common functions and variables for all scripts

# Get repository root, with fallback for non-git repositories
get_repo_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        # Fall back to script location for non-git repos
        local script_dir="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        (cd "$script_dir/../../.." && pwd)
    fi
}

# Get current branch, with fallback for non-git repositories
get_current_branch() {
    # First check if SPECIFY_FEATURE environment variable is set
    if [[ -n "${SPECIFY_FEATURE:-}" ]]; then
        echo "$SPECIFY_FEATURE"
        return
    fi

    # Then check git if available
    if git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD
        return
    fi

    # For non-git repos, try to find the latest feature directory
    local repo_root=$(get_repo_root)
    local specs_dir="$repo_root/specs"

    if [[ -d "$specs_dir" ]]; then
        local latest_feature=""
        local highest=0

        for dir in "$specs_dir"/*; do
            if [[ -d "$dir" ]]; then
                local dirname=$(basename "$dir")
                if [[ "$dirname" =~ ^([0-9]{3})- ]]; then
                    local number=${BASH_REMATCH[1]}
                    number=$((10#$number))
                    if [[ "$number" -gt "$highest" ]]; then
                        highest=$number
                        latest_feature=$dirname
                    fi
                elif [[ "$dirname" =~ ^CROWN-([0-9]+)- ]]; then
                    local number=${BASH_REMATCH[1]}
                    number=$((10#$number))
                    if [[ "$number" -gt "$highest" ]]; then
                        highest=$number
                        latest_feature=$dirname
                    fi
                fi
            fi
        done

        if [[ -n "$latest_feature" ]]; then
            echo "$latest_feature"
            return
        fi
    fi

    echo "main"  # Final fallback
}

# Check if we have git available
has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

check_feature_branch() {
    local branch="$1"
    local has_git_repo="$2"

    # For non-git repos, we can't enforce branch naming but still provide output
    if [[ "$has_git_repo" != "true" ]]; then
        echo "[specify] Warning: Git repository not detected; skipped branch validation" >&2
        return 0
    fi

    if [[ "$branch" =~ ^[0-9]{3}- ]]; then
        return 0
    fi

    if [[ "$branch" =~ ^(feat|fix|chore|hotfix)/CROWN-[0-9]+- ]]; then
        return 0
    fi

    if [[ ! "$branch" =~ ^CROWN-[0-9]+- ]]; then
        echo "ERROR: Not on a feature branch. Current branch: $branch" >&2
        echo "Feature branches should be named like: 001-feature-name or feat/CROWN-123-feature-name" >&2
        return 1
    fi
}

get_feature_dir() { echo "$1/specs/$2"; }

# Normalize a Jira-linked git branch to the matching specs directory name.
normalize_branch_to_feature_name() {
    local branch_name="$1"

    if [[ "$branch_name" =~ ^(feat|fix|chore|hotfix)/(CROWN-[0-9]+-.+)$ ]]; then
        echo "${BASH_REMATCH[2]}"
        return
    fi

    echo "$branch_name"
}

# Find feature directory by either Jira key or numeric prefix.
find_feature_dir() {
    local repo_root="$1"
    local branch_name="$2"
    local specs_dir="$repo_root/specs"
    local feature_name

    feature_name=$(normalize_branch_to_feature_name "$branch_name")

    if [[ -d "$specs_dir/$feature_name" ]]; then
        echo "$specs_dir/$feature_name"
        return
    fi

    # Extract Jira issue key from the normalized feature name (e.g., "CROWN-6")
    if [[ "$feature_name" =~ ^(CROWN-[0-9]+)- ]]; then
        local jira_key="${BASH_REMATCH[1]}"
        local jira_matches=()

        if [[ -d "$specs_dir" ]]; then
            for dir in "$specs_dir"/"$jira_key"-*; do
                if [[ -d "$dir" ]]; then
                    jira_matches+=("$(basename "$dir")")
                fi
            done
        fi

        if [[ ${#jira_matches[@]} -eq 1 ]]; then
            echo "$specs_dir/${jira_matches[0]}"
            return
        elif [[ ${#jira_matches[@]} -gt 1 ]]; then
            echo "ERROR: Multiple spec directories found for Jira key '$jira_key': ${jira_matches[*]}" >&2
            echo "$specs_dir/$feature_name"
            return
        fi
    fi

    # Fall back to numeric prefix lookup for legacy spec-kit directories.
    if [[ ! "$feature_name" =~ ^([0-9]{3})- ]]; then
        echo "$specs_dir/$feature_name"
        return
    fi

    local prefix="${BASH_REMATCH[1]}"

    # Search for directories in specs/ that start with this prefix
    local matches=()
    if [[ -d "$specs_dir" ]]; then
        for dir in "$specs_dir"/"$prefix"-*; do
            if [[ -d "$dir" ]]; then
                matches+=("$(basename "$dir")")
            fi
        done
    fi

    # Handle results
    if [[ ${#matches[@]} -eq 0 ]]; then
        # No match found - return the branch name path (will fail later with clear error)
        echo "$specs_dir/$branch_name"
    elif [[ ${#matches[@]} -eq 1 ]]; then
        # Exactly one match - perfect!
        echo "$specs_dir/${matches[0]}"
    else
        # Multiple matches - this shouldn't happen with proper naming convention
        echo "ERROR: Multiple spec directories found with prefix '$prefix': ${matches[*]}" >&2
        echo "Please ensure only one spec directory exists per numeric prefix." >&2
        echo "$specs_dir/$feature_name"  # Return something to avoid breaking the script
    fi
}

get_feature_paths() {
    local repo_root=$(get_repo_root)
    local current_branch=$(get_current_branch)
    local has_git_repo="false"

    if has_git; then
        has_git_repo="true"
    fi

    # Support both Jira-linked branch names and legacy numeric spec-kit feature names
    local feature_dir=$(find_feature_dir "$repo_root" "$current_branch")

    cat <<EOF
REPO_ROOT='$repo_root'
CURRENT_BRANCH='$current_branch'
HAS_GIT='$has_git_repo'
FEATURE_DIR='$feature_dir'
FEATURE_SPEC='$feature_dir/spec.md'
IMPL_PLAN='$feature_dir/plan.md'
TASKS='$feature_dir/tasks.md'
RESEARCH='$feature_dir/research.md'
DATA_MODEL='$feature_dir/data-model.md'
QUICKSTART='$feature_dir/quickstart.md'
CONTRACTS_DIR='$feature_dir/contracts'
EOF
}

check_file() { [[ -f "$1" ]] && echo "  ✓ $2" || echo "  ✗ $2"; }
check_dir() { [[ -d "$1" && -n $(ls -A "$1" 2>/dev/null) ]] && echo "  ✓ $2" || echo "  ✗ $2"; }

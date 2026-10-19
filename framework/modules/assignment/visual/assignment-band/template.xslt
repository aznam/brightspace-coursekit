<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    version="1.0">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template name="separator">
        <div class="aband-sep"/>
    </xsl:template>


    <xsl:template name="metadata-item">
        <xsl:param name="label"/>
        <xsl:param name="value"/>
        <xsl:if test="string($value) != ''">
            <div class="aband-meta-item">
                <span class="aband-meta-label" data-label="{$label}">
                    <xsl:if test="$label = 'Est. Time'">
                        <span class="aband-icon" data-icon="estimated-time" aria-hidden="true" hidden="hidden"/>
                    </xsl:if>
                    <xsl:value-of select="$label"/>
                </span>
                <span class="aband-meta-value"><xsl:value-of select="$value"/></span>
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="/">
        <xsl:variable name="band" select="/*"/>
        <xsl:variable name="extended" select="string($band/@deadline-extension-at) != ''"/>
        <xsl:variable name="policy" select="string($band/@ai-policy)"/>
        <xsl:variable name="difficulty" select="string($band/@difficulty)"/>

        <div class="ck-assignment-band assignment-band" aria-label="Assignment information">
            <div class="aband-strip" role="button" tabindex="0" aria-expanded="false" aria-controls="ck-assignment-band-details">
                <span class="aband-strip-items" aria-live="off">
                    <xsl:if test="$band/@open != ''">
                        <div class="aband-item">
                            <span class="aband-item-label">Opens</span>
                            <span class="aband-item-value" data-date="open"><xsl:value-of select="$band/@open"/></span>
                        </div>
                        <xsl:call-template name="separator"/>
                    </xsl:if>

                    <div class="aband-item">
                        <span class="aband-item-label">
                            <span class="aband-deadline-label" data-deadline-type="{$band/@deadline-type}">
                                <span class="aband-icon" data-icon="deadline-{$band/@deadline-type}" aria-hidden="true" hidden="hidden"/>
                                <xsl:value-of select="$band/@deadline-type"/>
                                <xsl:text> Deadline</xsl:text>
                            </span>
                        </span>
                        <span data-date="deadline-at">
                            <xsl:attribute name="class">
                                <xsl:text>aband-item-value</xsl:text>
                                <xsl:if test="$extended"><xsl:text> aband-struck</xsl:text></xsl:if>
                            </xsl:attribute>
                            <xsl:value-of select="$band/@deadline-at"/>
                        </span>
                        <xsl:if test="$extended">
                            <span class="aband-ext-date" data-date="deadline-extension-at"><xsl:value-of select="$band/@deadline-extension-at"/></span>
                            <xsl:if test="$band/@deadline-extension-reason != ''">
                                <span class="aband-ext-reason">(<xsl:value-of select="$band/@deadline-extension-reason"/>)</span>
                            </xsl:if>
                        </xsl:if>
                    </div>
                    <xsl:call-template name="separator"/>

                    <div class="aband-item aband-item-progress">
                        <div class="aband-progress">
                            <div class="aband-progress-track">
                                <div class="aband-progress-fill aband-fill-ok"/>
                            </div>
                            <span class="aband-progress-label" role="timer" aria-label="Time remaining"/>
                        </div>
                    </div>

                    <xsl:if test="$band/@submission-type != ''">
                        <xsl:call-template name="separator"/>
                        <div class="aband-item">
                            <span class="aband-badge aband-badge-sub" data-submission-type="{$band/@submission-type}">
                                <span class="aband-icon" data-icon="submission-{$band/@submission-type}" aria-hidden="true" hidden="hidden"/>
                                <xsl:choose>
                                    <xsl:when test="$band/@submission-type = 'group'">
                                        <xsl:text>Group</xsl:text>
                                        <xsl:if test="$band/@submission-group-size != ''">
                                            <xsl:text> (</xsl:text>
                                            <xsl:value-of select="$band/@submission-group-size"/>
                                            <xsl:text>)</xsl:text>
                                        </xsl:if>
                                    </xsl:when>
                                    <xsl:otherwise>Individual</xsl:otherwise>
                                </xsl:choose>
                            </span>
                        </div>
                    </xsl:if>

                    <xsl:if test="$policy != ''">
                        <xsl:call-template name="separator"/>
                        <div class="aband-item">
                            <span class="aband-badge aband-badge-ai" data-ai-policy="{$policy}">
                                <span class="aband-icon" data-icon="ai-{$policy}" aria-hidden="true" hidden="hidden"/>
                                <xsl:text>AI: </xsl:text>
                                <xsl:choose>
                                    <xsl:when test="$policy = 'unrestricted'">Unrestricted</xsl:when>
                                    <xsl:when test="$policy = 'restricted'">Restricted</xsl:when>
                                    <xsl:when test="$policy = 'forbidden'">Forbidden</xsl:when>
                                    <xsl:when test="$policy = 'default'">Default policy</xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="$policy"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </span>
                        </div>
                    </xsl:if>
                </span>
                <span class="aband-expand-hint" aria-hidden="true">Details <span class="aband-icon" data-icon="expand" aria-hidden="true" hidden="hidden"/></span>
            </div>

            <div class="aband-panel" id="ck-assignment-band-details" aria-hidden="true">
                <div class="aband-panel-inner">
                    <xsl:if test="$band/*">
                        <div class="aband-panel-block">
                            <span class="aband-panel-block-label">Learning Outcomes</span>
                            <div class="aband-lo-list">
                                <ck-children/>
                            </div>
                        </div>
                    </xsl:if>

                    <div class="aband-panel-block aband-panel-meta">
                        <xsl:call-template name="metadata-item">
                            <xsl:with-param name="label" select="'Est. Time'"/>
                            <xsl:with-param name="value" select="$band/@estimated-time"/>
                        </xsl:call-template>
                        <xsl:if test="$band/@difficulty != ''">
                            <div class="aband-meta-item">
                                <span class="aband-meta-label">Difficulty</span>
                                <span class="aband-meta-value aband-difficulty" data-difficulty="{$difficulty}">
                                    <span class="aband-icon" data-icon="difficulty-{$difficulty}" aria-hidden="true" hidden="hidden"/>
                                    <xsl:choose>
                                        <xsl:when test="$difficulty = 'easy'">Easy</xsl:when>
                                        <xsl:when test="$difficulty = 'medium'">Medium</xsl:when>
                                        <xsl:when test="$difficulty = 'hard'">Hard</xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="$difficulty"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </span>
                            </div>
                        </xsl:if>
                        <xsl:if test="$band/@weight != ''">
                            <div class="aband-meta-item">
                                <span class="aband-meta-label">Weight</span>
                                <span class="aband-meta-value"><xsl:value-of select="$band/@weight"/>%</span>
                            </div>
                        </xsl:if>
                        <xsl:if test="$band/@points != ''">
                            <div class="aband-meta-item">
                                <span class="aband-meta-label">Points</span>
                                <span class="aband-meta-value"><xsl:value-of select="$band/@points"/> pts</span>
                            </div>
                        </xsl:if>
                        <xsl:if test="$band/@rubrics-provided != ''">
                            <div class="aband-meta-item">
                                <span class="aband-meta-label">Rubrics</span>
                                <span class="aband-meta-value aband-rubrics" data-rubrics-provided="{$band/@rubrics-provided}">
                                    <span class="aband-icon" data-icon="rubrics-{$band/@rubrics-provided}" aria-hidden="true" hidden="hidden"/>
                                    <xsl:choose>
                                        <xsl:when test="$band/@rubrics-provided = 'true'">Provided</xsl:when>
                                        <xsl:otherwise>Not provided</xsl:otherwise>
                                    </xsl:choose>
                                </span>
                            </div>
                        </xsl:if>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
